import 'reflect-metadata';

import express, { Express, Request, Response } from 'express';
import cors from 'cors';

import { AppDataSource } from './data-source';

import { config } from './config';
import { PlayRepository } from './repository/play';
import { RoundRepository } from './repository/round';
import { PaginationParams, pagination } from './middlewares/pagination';
import { CSPRCloudAPIClient } from './cspr-cloud/api-client';

const app: Express = express();
app.use(cors<Request>());
app.use(express.json());

const port = config.httpPort;

interface FindPlaysQuery extends PaginationParams {
  player_account_hash: string;
}

(async function () {
  await AppDataSource.initialize();

  const playsRepository = new PlayRepository(AppDataSource);
  const roundsRepository = new RoundRepository(AppDataSource);

  const csprCloudClient = new CSPRCloudAPIClient(config.csprCloudApiUrl, config.csprCloudAccessKey);

  app.get('/plays', pagination(), async (req: Request<never, never, never, FindPlaysQuery>, res: Response) => {
    const [plays, total] = await playsRepository.findByPlayer(
      req.query.player_account_hash,
      {
        limit: req.query.limit,
        offset: req.query.offset,
      }
    );

    await csprCloudClient.withPublicKeys(plays);

    res.json({ data: plays, total });
  });

  app.get('/rounds', pagination(), async (req: Request<never, never, never, PaginationParams>, res: Response) => {
    const [rounds, total] = await roundsRepository.getRounds(
      req.query.limit,
      req.query.offset,
    );

    await csprCloudClient.withPublicKeys(rounds);

    res.json({ data: rounds, total });
  });

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
})();

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
