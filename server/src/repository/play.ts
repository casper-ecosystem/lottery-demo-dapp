import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { Play } from '../entity/play.entity';

interface FindPlaysFilters {
  playerAccountHash?: string;
  roundId?: string;
}

export class PlayRepository {
  private repo: Repository<Play>;
  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Play);
  }

  getPaginatedPlays(
    filters: FindPlaysFilters,
    pagination: { limit: number; offset: number },
  ): Promise<[Play[], number]> {
    const options: FindManyOptions<Play> = {
      order: {
        timestamp: 'DESC',
      },
    };

    if (pagination.limit !== -1) {
      options.take = pagination.limit;
      options.skip = pagination.offset;
    }

    if (filters.playerAccountHash) {
      options.where = {
        playerAccountHash: filters.playerAccountHash,
      };
    }

    if (filters.roundId) {
      options.where = {
        roundId: filters.roundId,
      };
    }

    return this.repo.findAndCount(options);
  }

  getLatestRoundPlays(pagination: { limit: number; offset: number }) {
    const queryBuilder = this.repo
      .createQueryBuilder()
      .where((qb) => {
        const subQuery = qb.subQuery().select('max(round_id)').from(Play, 'maxp').getQuery();
        return 'round_id = ' + subQuery;
      })
      .orderBy('timestamp', 'DESC');

    if (pagination.limit !== -1) {
      queryBuilder.limit(pagination.limit).offset(pagination.offset);
    }

    return queryBuilder.getManyAndCount();
  }

  save(play: Partial<Play>) {
    return this.repo.save(play);
  }
}
