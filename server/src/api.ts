import 'reflect-metadata';

import http from 'http';
import path from 'path';

import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { AppDataSource } from './data-source';

import { config } from './config';
import { PlayRepository } from './repository/play';

import fs from 'fs';
import { RoundRepository } from './repository/round';
import { PaginationParams, pagination } from './middleware/pagination';
import { CSPRCloudAPIClient } from './cspr-cloud/api-client';

const app: Express = express();
app.use(
  cors<Request>({
    origin: config.clientURL,
  }),
);
app.use(express.json({ limit: '1mb' }));

const server = http.createServer(app);

interface FindPlaysByPlayerParams {
  player_account_hash: string;
}

interface FindPlaysByRoundParams {
  round_id: string;
}

async function main() {
  await AppDataSource.initialize();

  const playsRepository = new PlayRepository(AppDataSource);
  const roundsRepository = new RoundRepository(AppDataSource);

  const csprCloudClient = new CSPRCloudAPIClient(config.csprCloudApiUrl, config.csprCloudAccessKey);

  const csprCloudStreamingProxy = createProxyMiddleware({
    target: config.csprCloudStreamingUrl,
    ws: true,
    changeOrigin: true,
    headers: {
      authorization: config.csprCloudAccessKey,
    },
  });
  app.get('/deploys', csprCloudStreamingProxy);

  const csprCloudAPIProxy = createProxyMiddleware({
    target: config.csprCloudApiUrl,
    changeOrigin: true,
    headers: {
      authorization: config.csprCloudAccessKey,
    },
  });
  app.get('/accounts/:account_hash', csprCloudAPIProxy);

  app.get('/players/:player_account_hash/plays', pagination(), async (req: Request<FindPlaysByPlayerParams, never, never, PaginationParams>, res: Response) => {
    const [plays, total] = await playsRepository.getPaginatedPlays({
      playerAccountHash: req.params.player_account_hash,
    },{
      limit: req.query.limit,
      offset: req.query.offset,
    });

    await csprCloudClient.withPublicKeys(plays);

    res.json({ data: plays, total });
  });

  app.get('/rounds/:round_id/plays', pagination(), async (req: Request<FindPlaysByRoundParams, never, never, PaginationParams>, res: Response) => {
    const [plays, total] = await playsRepository.getPaginatedPlays({
      roundId: req.params.round_id,
    },{
      limit: req.query.limit,
      offset: req.query.offset,
    });

    await csprCloudClient.withPublicKeys(plays);

    res.json({ data: plays, total });
  });

  app.get('/rounds/latest/plays', pagination(), async (req: Request<never, never, never, PaginationParams>, res: Response) => {
    const [plays, total] = await playsRepository.getLatestRoundPlays({
      limit: req.query.limit,
      offset: req.query.offset,
    });

    await csprCloudClient.withPublicKeys(plays);

    res.json({ data: plays, total });
  });

  app.get('/rounds/latest', async (req: Request, res: Response) => {
    const round = await roundsRepository.getLatest();

    await csprCloudClient.withPublicKeys([round]);

    res.json({ data: round });
  });

  app.get('/rounds', pagination(), async (req: Request<never, never, never, PaginationParams>, res: Response) => {
    const [rounds, total] = await roundsRepository.getPaginatedRounds({
      limit: req.query.limit,
      offset: req.query.offset,
    });

    await csprCloudClient.withPublicKeys(rounds);

    res.json({ data: rounds, total });
  });

  app.get('/proxy-wasm', async (req: Request, res: Response) => {
    fs.createReadStream(path.resolve(__dirname, `./resources/proxy_caller.wasm`)).pipe(res);
  });

  server.listen(config.httpPort, () => console.log(`Server running on http://localhost:${config.httpPort}`));
}

main();

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
