import 'reflect-metadata';

import { config } from './config';

import { Play } from './entity/play.entity';
import { PlayRepository } from './repository/play';
import { Event, PlayEventPayload } from './events';

export async function trackPlay(event: Event<PlayEventPayload>, playsRepository: PlayRepository) {
  const play: Partial<Play> = {
    playId: Math.floor(Math.random() * 999999999).toString(),
    roundId: Math.floor(Math.random() * 999999999).toString(),
    playerAccountHash: '17fd44a38b0c7366c8a234e285c5a3dd046e9699ee4dff0249bb3f2989e17cf4',
    prizeAmount: '100000044',
    isJackpot: false,
    deployHash: event.extra.deploy_hash,
    timestamp: new Date(),
  };

  return playsRepository.save(play);
}
