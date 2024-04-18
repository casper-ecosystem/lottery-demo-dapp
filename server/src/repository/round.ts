import { DataSource, FindManyOptions, Repository } from 'typeorm';
import 'reflect-metadata';
import { Round } from '../entity/round.entity';

export class RoundRepository {
  private repo: Repository<Round>;
  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Round);
  }

  async getPaginatedRounds(
    pagination: { limit: number; offset: number },
  ): Promise<[Round[], number]> {
    const options: FindManyOptions<Round> = {
      take: pagination.limit,
      skip: pagination.offset,
      order: {
        roundId: 'DESC',
      },
    };

    return this.repo.findAndCount(options);
  }

  async getLatest(): Promise<Round> {
    const queryBuilder = this.repo
      .createQueryBuilder()
      .orderBy('round_id', 'DESC')
      .limit(1);

    return queryBuilder.getOne();
  }
}
