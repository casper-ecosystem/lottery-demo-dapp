import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { Play } from '../entity/play.entity';

interface FindManyParams {
  limit: number;
  offset: number;
  playerAccountHash?: string;
  roundId?: string;
}

export class PlayRepository {
  private repo: Repository<Play>;
  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Play);
  }

  getPaginatedPlays(params: FindManyParams): Promise<[Play[], number]> {
    const options: FindManyOptions<Play> = {
      take: params.limit,
      skip: params.offset,
      order: {
        timestamp: 'DESC',
      },
    };

    if (params.playerAccountHash) {
      options.where = {
        playerAccountHash: params.playerAccountHash,
      }
    }

    if (params.roundId) {
      options.where = {
        roundId: params.roundId,
      }
    }

    return this.repo.findAndCount(options);
  }

  getLatestRoundPlays(params: { limit: number; offset: number }) {
    const queryBuilder = this.repo.createQueryBuilder()
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select("max(round_id)")
          .from(Play, 'maxp')
          .getQuery();
        return "round_id = " + subQuery;
      })
      .limit(params.limit)
      .offset(params.offset)
      .orderBy('timestamp', 'DESC');

    return queryBuilder.getManyAndCount();
  }

  save(play: Partial<Play>) {
    return this.repo.save(play);
  }
}
