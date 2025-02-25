import { DataSource, FindManyOptions, Repository } from 'typeorm';
import 'reflect-metadata';
import { Round } from '../entity/round.entity';

export class RoundRepository {
  private repo: Repository<Round>;
  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Round);
  }

  async getPaginatedRounds(pagination: { limit: number; offset: number }, params: { isFinished: boolean } = { isFinished: false }): Promise<[Round[], number]> {
    const options: FindManyOptions<Round> = {
      order: {
        roundId: 'DESC',
      },
    };

    if (pagination.limit !== -1) {
      options.take = pagination.limit;
      options.skip = pagination.offset;
    }

    if (params.isFinished) {
      options.where = { isFinished: true };
    }

    return this.repo.findAndCount(options);
  }

  async getLatest(params: { isFinished: boolean } = { isFinished: false }): Promise<Round> {
    const queryBuilder = this.repo.createQueryBuilder().orderBy('round_id', 'DESC').limit(1);

    if (params.isFinished) {
      queryBuilder.where({ isFinished: true });
    }

    return queryBuilder.getOne();
  }
}
