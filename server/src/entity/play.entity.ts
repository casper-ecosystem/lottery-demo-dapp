import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'plays' })
export class Play {
  @PrimaryColumn({ name: 'play_id' })
  playId: string;

  @Column({ name: 'round_id' })
  roundId: string;

  @Column({ name: 'player_account_hash' })
  playerAccountHash: string;

  playerPublicKey?: string;

  @Column({ name: 'prize_amount' })
  prizeAmount: string;

  @Column({ name: 'jackpot_amount' })
  jackpotAmount: string;

  @Column({ name: 'is_jackpot' })
  isJackpot: boolean;

  @Column({ name: 'deploy_hash', unique: true })
  deployHash: string;

  @Column({ name: 'timestamp' })
  timestamp: Date;

  getAccountHash() {
    return this.playerAccountHash;
  }

  setPublicKey(publicKey: string) {
    this.playerPublicKey = publicKey;
  }
}
