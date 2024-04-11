import 'reflect-metadata';

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import http from 'http';
import path from 'path';

import { AppDataSource } from './data-source';

import { config } from './config';
import { PlayRepository } from './repository/play';

import fs from 'fs';
import { RoundRepository } from './repository/round';
import { PaginationParams, pagination } from './middlewares/pagination';
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

  app.get('/players/:player_account_hash/plays', pagination(), async (req: Request<FindPlaysByPlayerParams, never, never, PaginationParams>, res: Response) => {
    const [plays, total] = await playsRepository.getPaginatedPlays({
      limit: req.query.limit,
      offset: req.query.offset,
      playerAccountHash: req.params.player_account_hash,
    });

    await csprCloudClient.withPublicKeys(plays);

    res.json({ data: plays, total });
  });

  app.get('/plays', pagination(), async (req: Request<never, never, never, PaginationParams>, res: Response) => {
    const [plays, total] = await playsRepository.getPaginatedPlays({
      limit: req.query.limit,
      offset: req.query.offset,
    });

    await csprCloudClient.withPublicKeys(plays);

    res.json({ data: plays, total });
  });

  app.get('/rounds/:round_id/plays', pagination(), async (req: Request<FindPlaysByRoundParams, never, never, PaginationParams>, res: Response) => {
    const [plays, total] = await playsRepository.getPaginatedPlays({
      limit: req.query.limit,
      offset: req.query.offset,
      roundId: req.params.round_id,
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

  app.get('/rounds', pagination(), async (req: Request<never, never, never, PaginationParams>, res: Response) => {
    const [rounds, total] = await roundsRepository.getPaginatedRounds(req.query.limit, req.query.offset);

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
