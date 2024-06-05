import 'reflect-metadata';

import { config } from './config';
import WebSocket from 'ws';

import { Play } from './entity/play.entity';
import { PlayRepository } from './repository/play';
import { PlayEventPayload, Event } from './events';
import { AppDataSource } from './data-source';

async function main() {
  await AppDataSource.initialize();
  const playsRepository = new PlayRepository(AppDataSource);
  
  const ws = new WebSocket(
    `${config.csprCloudStreamingUrl}/contract-events?contract_package_hash=${config.lotteryContractPackageHash}`,
    {
      headers: {
        authorization: config.csprCloudAccessKey,
      },
    },
  );

  ws.on('open', () => {
    console.log(`Connected to streaming API: ${config.csprCloudStreamingUrl}`);
  })

  ws.on('message', async (data: Buffer) => {
    const rawData = data.toString();
    if (rawData === 'Ping') {
      return;
    }

    try {
      console.log('New event: ', rawData);
      
      const event = JSON.parse(rawData) as Event<PlayEventPayload>;

      const play: Partial<Play> = {
        playId: event.data.data.play_id,
        roundId: event.data.data.round_id.toString(),
        playerAccountHash: event.data.data.player.replace(/^account-hash-/, ''),
        prizeAmount: event.data.data.prize_amount,
        jackpotAmount: event.data.data.jackpot_amount,
        isJackpot: event.data.data.is_jackpot,
        deployHash: event.extra.deploy_hash,
        timestamp: new Date(event.data.data.timestamp),
      };
      await playsRepository.save(play);
    } catch (err) {
      console.log('Error parsing message:', err);
    }
  });

  ws.on('error', (err) => {
    console.log(`Received a WS error: ${err.message}`);
    ws.close();
    console.log('Disconnected from Streaming API');
    process.exit(1);
  })

  ws.on('close', () => {
    console.log('Disconnected from Streaming API');
    process.exit(1);
  });

  console.log('Handler started running...')
}

main();
