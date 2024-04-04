import 'reflect-metadata';

import { Play } from './entity/play.entity';
import { PlayRepository } from './repository/play';
import { Event, PlayEventPayload } from './events';

export async function trackPlay(event: Event<PlayEventPayload>, playsRepository: PlayRepository) {
  const play: Partial<Play> = {
    playId: event.data.data.play_id,
    roundId: event.data.data.round_id.toString(),
    playerAccountHash: event.data.data.player,
    prizeAmount: event.data.data.prize,
    isJackpot: event.data.data.is_jackpot,
    deployHash: event.extra.deploy_hash,
    timestamp: new Date(event.data.data.timestamp * 1000),
  };

  return playsRepository.save(play);
}
