import { DataSource, Repository } from 'typeorm';
import { Round } from '../entity/round.entity';

export class RoundRepository {
  private repo: Repository<Round>;
  constructor(private dataSource: DataSource) {
    this.repo = dataSource.getRepository(Round);
  }

  async getRounds(limit: number, offset: number): Promise<[Round[], number]> {
    const queryBuilder = this.repo
      .createQueryBuilder('p')
      .select('p.round_id', 'round_id')
      .addSelect('w.plays_num', 'plays_num')
      .addSelect('p.prize_amount', 'jackpot_amount')
      .addSelect('p.player_account_hash', 'winner_account_hash')
      .addSelect('p.timestamp', 'ended_at')
      .innerJoin(
        (subQuery) => {
          return subQuery
            .select('MAX(play_id)', 'play_id')
            .addSelect('COUNT(*)', 'plays_num')
            .from('plays', 'plays')
            .groupBy('round_id');
        },
        'w',
        'w.play_id = p.play_id',
      )
      .orderBy('p.round_id', 'DESC')
      .limit(limit)
      .offset(offset);

    const query = queryBuilder.getQueryAndParameters();
    console.log({ query });

    const [res, total] = await Promise.all([queryBuilder.getRawMany(), queryBuilder.getCount()]);

    const rounds = res.map((r) => {
      const round = new Round();
      round.roundId = r.round_id;
      round.playsNum = r.plays_num;
      round.jackpotAmount = r.jackpot_amount;
      round.winnerAccountHash = r.winner_account_hash;
      round.endedAt = r.ended_at;
      return round;
    });

    return [rounds, total];
  }
}
