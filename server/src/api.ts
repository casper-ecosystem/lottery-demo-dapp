import 'reflect-metadata';

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import WebSocket from 'ws';
import http from 'http';

import { AppDataSource } from './data-source';

import { config } from './config';
import { PlayRepository } from './repository/play';

import fs from 'fs';
import { RoundRepository } from './repository/round';
import { PaginationParams, pagination } from './middlewares/pagination';
import { CSPRCloudAPIClient } from './cspr-cloud/api-client';
import { PlayEventPayload, isPlayDeploy, isEvent, isPlayEventPayload } from './events';
import { trackPlay } from './event-handler';
import { raw } from 'mysql2';
import { Play } from './entity/play.entity';

const app: Express = express();
app.use(cors<Request>());
app.use(express.json({ limit: '1mb' }));

const port = config.httpPort;

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

interface FindPlaysQuery extends PaginationParams {
  player_account_hash: string;
}

async function initAPI() {
  await AppDataSource.initialize();

  const playsRepository = new PlayRepository(AppDataSource);
  const roundsRepository = new RoundRepository(AppDataSource);

  const csprCloudClient = new CSPRCloudAPIClient(config.csprCloudApiUrl, config.csprCloudAccessKey);

  app.get('/playsByPlayer', pagination(), async (req: Request<never, never, never, FindPlaysQuery>, res: Response) => {
    const [plays, total] = await playsRepository.findByPlayer(req.query.player_account_hash, {
      limit: req.query.limit,
      offset: req.query.offset,
    });

    await csprCloudClient.withPublicKeys(plays);

    res.json({ data: plays, total });
  });

  app.get('/plays', pagination(), async (req: Request<never, never, never, FindPlaysQuery>, res: Response) => {
    const [plays, total] = await playsRepository.getPaginatedPlays({
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

  app.get('/proxy-wasm', async (req: Request, res: Response) => {
    const wasm = new Uint8Array(fs.readFileSync(`../proxy_caller.wasm`));
    res.send(Buffer.from(wasm));
  });

  app.get('/initDeployListener', (req: Request, res: Response) => {
    try {
      if (req.query.publicKey == null) {
        res.status(400).send('No public key provided');
        return;
      }
      initWebSocketClient(req.query.publicKey);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  app.get('/playByDeployHash', async (req: Request, res: Response) => {
    if (req.query.deployHash === null) {
      res.status(400).send('No deploy hash provided');
      return;
    }
    try {
      const play: Play = await playsRepository.findByDeployHash(req.query.deployHash as string);
      res.send(JSON.stringify(play));
    } catch (error) {
      console.error(error);
      res.status(500).send('Error getting deploy by deploy hash');
    }
  });

  server.listen(port, () => console.log(`Server running on http://localhost:${port}`));
}

async function initWebSocketClient(publicKey) {
  const ws = new WebSocket(`${config.csprCloudStreamingUrl}/deploys?caller_public_key=${publicKey}`, {
    headers: {
      authorization: config.csprCloudAccessKey,
    },
  });

  let ttl = setTimeout(() => {
    ws.close();
  }, 90000); // 90 secs

  function notifyClients(error: string | null) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(error);
      }
    });
  }

  ws.on('message', async (data: Buffer) => {
    const rawData = data.toString();
    if (rawData === 'Ping') {
      return;
    }
    const deploy = JSON.parse(rawData);
    if (isPlayDeploy(deploy) && deploy.data.args.contract_package_hash.parsed === config.lotteryContractPackageHash) {
      notifyClients(
        JSON.stringify({ detected_deploy: { error: deploy.data.error_message, deployHash: deploy.data.deploy_hash } }),
      );
      clearTimeout(ttl);
      ws.close();
    } else {
      console.log('Received an unexpected message format');
    }

    console.log(rawData);
  });

  ws.on('close', () => {
    clearTimeout(ttl);
  });

  ws.on('error', (_) => {
    clearTimeout(ttl);
    ws.close();
  });
}

initAPI();

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
