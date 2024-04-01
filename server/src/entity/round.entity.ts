import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'plays' })
export class Round {
  @PrimaryColumn({ name: 'round_id' })
  roundId: string;

  @Column({ name: 'plays_num' })
  playsNum: string;

  @Column({ name: 'jackpot_amount' })
  jackpotAmount: string;

  @Column({ name: 'winner_account_hash' })
  winnerAccountHash: string;

  winnerPublicKey?: string;

  @Column({ name: 'ended_at' })
  endedAt: Date;
}
