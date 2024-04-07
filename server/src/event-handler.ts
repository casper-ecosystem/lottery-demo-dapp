import 'reflect-metadata';

import { config } from './config';
import WebSocket from 'ws';

import { Play } from './entity/play.entity';
import { PlayRepository } from './repository/play';
import { PlayEventPayload, isEvent, isPlayEventPayload, Event } from './events';
import { AppDataSource } from './data-source';

async function initDB() {
  await AppDataSource.initialize();
  const playsRepository = new PlayRepository(AppDataSource);
  initWebSocketClient(playsRepository);
}

function initWebSocketClient(playsRepository) {
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
    process.exit(1);
  });
}

export async function trackPlay(event: Event<PlayEventPayload>, playsRepository: PlayRepository) {
  const play: Partial<Play> = {
    playId: event.data.data.play_id,
    roundId: event.data.data.round_id.toString(),
    playerAccountHash: toRawAccountHashStr(event.data.data.player),
    prizeAmount: event.data.data.prize,
    isJackpot: event.data.data.is_jackpot,
    deployHash: event.extra.deploy_hash,
    timestamp: new Date(event.data.data.timestamp),
  };

  return playsRepository.save(play);
}

function toRawAccountHashStr(text: string): string {
  const pattern = /^account-hash-/;
  return text.replace(pattern, '');
}

initDB();
