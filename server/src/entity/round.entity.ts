import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'rounds' })
export class Round {
  @ViewColumn({ name: 'round_id' })
  roundId: string;

  @ViewColumn({ name: 'plays_num' })
  playsNum: string;

  @ViewColumn({ name: 'jackpot_amount' })
  jackpotAmount: string;

  @ViewColumn({ name: 'winner_account_hash' })
  winnerAccountHash: string;

  @ViewColumn({ name: 'is_finished' })
  isFinished: boolean;

  winnerPublicKey?: string;

  @ViewColumn({ name: 'ended_at' })
  endedAt: Date;

  getAccountHash() {
    return this.winnerAccountHash;
  }

  setPublicKey(publicKey: string) {
    this.winnerPublicKey = publicKey;
  }
}
