import 'reflect-metadata';

import { config } from './config';

import WebSocket from 'ws';

import { AppDataSource } from './data-source';
import { Play } from './entity/play.entity';
import { PlayRepository } from './repository/play';

interface PlayEventPayload {}

interface Event<T> {
  action: string
  data: {
    contract_package_hash: string
    contract_hash: string
    name: string
    data: T
  }
  extra: {
    deploy_hash: string
    event_id: number
    transform_id: number
  }
}

(async function () {
  await AppDataSource.initialize();

  const playsRepository = new PlayRepository(AppDataSource);

  const ws = new WebSocket(`${config.csprCloudStreamingUrl}/contract-events?contract_package_hash=${config.lotteryContractPackageHash}`, {
    headers: {
      authorization: config.csprCloudAccessKey,
    }
  });

  ws.on('open', () => {
    console.log('Connected to Streaming API');
  });

  ws.on('message', async (data: Buffer) => {
    const rawData = data.toString();
    console.log(`Received message from server: ${rawData}`);
    if (rawData === "Ping") {
      return;
    }

    const event = JSON.parse(rawData) as Event<PlayEventPayload>;

    await trackPlay(event);
  });

  ws.on('close', () => {
    console.log('Disconnected from Streaming API');
  });

  async function trackPlay(event: Event<PlayEventPayload>) {
    const play: Partial<Play> = {
      playId: Math.floor(Math.random() * 999999999).toString(),
      roundId: Math.floor(Math.random() * 999999999).toString(),
      playerAccountHash: "17fd44a38b0c7366c8a234e285c5a3dd046e9699ee4dff0249bb3f2989e17cf4",
      prizeAmount: "100000044",
      isJackpot: false,
      deployHash: event.extra.deploy_hash,
      timestamp: new Date(),
    };

    return playsRepository.save(play);
  }
})();

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

async function shutdown() {
  try {
    await AppDataSource.destroy();

    process.exit(0);
  } catch(err) {
    console.log(`received error during graceful shutdown process: ${err.message}`);
    process.exit(1);
  }
}
