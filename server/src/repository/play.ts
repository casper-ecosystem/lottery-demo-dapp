import { DataSource, Repository } from 'typeorm';
import { Play } from '../entity/play.entity';

export class PlayRepository {
  private repo: Repository<Play>;
  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Play);
  }

  /**
   * @deprecated Use getPaginatedPlays
   */
  findByPlayer(playerAccountHash: string, paginationParams: { limit: number; offset: number }) {
    return this.repo.findAndCount({
      where: {
        playerAccountHash: playerAccountHash,
      },
      take: paginationParams.limit,
      skip: paginationParams.offset,
    });
  }

  /**
   * @deprecated Use getPaginatedPlays
   */
  findByDeployHash(deployHash: string): Promise<Play | null> {
    return this.repo.findOne({
      where: {
        deployHash: deployHash,
      },
    });
  }

  getPaginatedPlays(filters, paginationParams: { limit: number; offset: number }): Promise<[Play[], number]> {
    return this.repo.findAndCount({
      where: filters,
      take: paginationParams.limit,
      skip: paginationParams.offset,
      order: {
        timestamp: 'DESC', // This will order the results by timestamp in descending order
      },
    });
  }

  save(play: Partial<Play>) {
    return this.repo.save(play);
  }
}
