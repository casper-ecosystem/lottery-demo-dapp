import 'reflect-metadata';

import express, { Express, Request, Response } from 'express';
import cors from "cors";
import WebSocket from 'ws';

import { AppDataSource } from './data-source';

import { config } from './config';
import { PlayRepository } from './repository/play';
import { CasperClient, DeployUtil } from "casper-js-sdk";

const fs = require("fs");
import { RoundRepository } from './repository/round';
import { PaginationParams, pagination } from './middlewares/pagination';

const app: Express = express();
app.use(cors<Request>());
app.use(express.json());

const port = config.httpPort;

app.use(express.json({ limit: "1mb" }));
app.use(cors());

const wss = new WebSocket.Server({ port: 8080 });

const client = new CasperClient("http://135.181.14.226:7777/rpc");

wss.on('connection', (ws: WebSocket) => {
  console.log('New client connected');

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
interface FindPlaysQuery extends PaginationParams {
  player_account_hash: string;
}

(async function () {
  await AppDataSource.initialize();

  const playsRepository = new PlayRepository(AppDataSource);
  const roundsRepository = new RoundRepository(AppDataSource);


  app.get('/plays', pagination(), async (req: Request<never, never, never, FindPlaysQuery>, res: Response) => {
    const [plays, total] = await playsRepository.findByPlayer(
      req.query.player_account_hash,
      {
        limit: req.query.limit,
        offset: req.query.offset,
      }
    );

    res.json({ data: plays, total });
  });

  const ws = new WebSocket(`${config.csprCloudStreamingUrl}/contract-events?contract_package_hash=${config.lotteryContractPackageHash}`, {
    headers: {
      authorization: config.csprCloudAccessKey,
    }
  });

  ws.on('message', async (data: Buffer) => {
    const rawData = data.toString();
    console.log(`Received message from server: ${rawData}`);

    wss.clients.forEach((client) => {
      client.send(rawData);
    });

    if (rawData === "Ping") {
      return;
    }
  });

  ws.on('close', () => {
    console.log('Disconnected from Streaming API');
  });

  app.get('/plays', async (req: Request, res: Response) => {
    const plays = await playsRepository.findAll();
    res.json({ data: plays });
  });
  app.get('/rounds', pagination(), async (req: Request<never, never, never, PaginationParams>, res: Response) => {
    const [rounds, total] = await roundsRepository.getRounds(
      req.query.limit,
      req.query.offset,
    );

    res.json({ data: rounds, total });
  });
})();

app.get('/getProxyWASM', async (req: Request, res: Response) => {
  const wasm = new Uint8Array(fs.readFileSync(`../smart-contract/proxy_caller.wasm`));
  res.send(Buffer.from(wasm));
});


process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

async function shutdown() {
  try {
    await AppDataSource.destroy();

    process.exit(0);
  } catch (err) {
    console.log(`received error during graceful shutdown process: ${err.message}`);
    process.exit(1);
  }
}
