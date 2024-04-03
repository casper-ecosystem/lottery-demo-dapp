import 'reflect-metadata';

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';

import { AppDataSource } from './data-source';

import { config } from './config';
import { PlayRepository } from './repository/play';
import { CasperClient, DeployUtil } from 'casper-js-sdk';

import fs from 'fs';
import { RoundRepository } from './repository/round';
import { PaginationParams, pagination } from './middlewares/pagination';
import { CSPRCloudAPIClient } from './cspr-cloud/api-client';
import { PlayEventPayload, isEvent, isPlayEventPayload } from './events';
import { trackPlay } from './event-handler';

const app: Express = express();
app.use(cors<Request>());
app.use(express.json({ limit: '1mb' }));

const port = config.httpPort;

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const client = new CasperClient('http://135.181.14.226:7777/rpc');

interface FindPlaysQuery extends PaginationParams {
  player_account_hash: string;
}

(async function () {
  await AppDataSource.initialize();

  const playsRepository = new PlayRepository(AppDataSource);
  const roundsRepository = new RoundRepository(AppDataSource);

  const csprCloudClient = new CSPRCloudAPIClient(config.csprCloudApiUrl, config.csprCloudAccessKey);

  app.get('/plays', pagination(), async (req: Request<never, never, never, FindPlaysQuery>, res: Response) => {
    const [plays, total] = await playsRepository.findByPlayer(req.query.player_account_hash, {
      limit: req.query.limit,
      offset: req.query.offset,
    });

    await csprCloudClient.withPublicKeys(plays);

    res.json({ data: plays, total });
  });

  app.get('/rounds', pagination(), async (req: Request<never, never, never, PaginationParams>, res: Response) => {
    const [rounds, total] = await roundsRepository.getRounds(req.query.limit, req.query.offset);

    await csprCloudClient.withPublicKeys(rounds);

    res.json({ data: rounds, total });
  });

  app.get('/getProxyWASM', async (req: Request, res: Response) => {
    const wasm = new Uint8Array(fs.readFileSync(`../smart-contract/lottery/proxy_caller.wasm`));
    res.send(Buffer.from(wasm));
  });

  initWebSocketClient(playsRepository);

  server.listen(3001, () => console.log(`Server running on http://localhost:3001`));
})();

async function initWebSocketClient(playsRepository) {
  const ws = new WebSocket(
    `${config.csprCloudStreamingUrl}/contract-events?contract_package_hash=${config.lotteryContractPackageHash}`,
    {
      headers: {
        authorization: config.csprCloudAccessKey,
      },
    },
  );

  ws.on('message', async (data: Buffer) => {
    const rawData = data.toString();
    if (rawData === 'Ping') {
      return;
    }

    try {
      const event = JSON.parse(rawData);
      if (isEvent<PlayEventPayload>(event, isPlayEventPayload)) {
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(event));
          }
        });
        await trackPlay(event, playsRepository);
      } else {
        console.log('Received an unexpected message format:', event);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Disconnected from Streaming API');
  });
}

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
