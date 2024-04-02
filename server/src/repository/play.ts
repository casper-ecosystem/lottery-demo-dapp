import { DataSource, Repository } from 'typeorm';
import { Play } from '../entity/play.entity';

export class PlayRepository {
  private repo: Repository<Play>;
  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(Play);
  }

  findByPlayer(playerAccountHash: string, paginationParams: { limit: number; offset: number }) {
    return this.repo.findAndCount({
      where: {
        playerAccountHash: playerAccountHash,
      },
      take: paginationParams.limit,
      skip: paginationParams.offset,
    });
  }

  save(play: Partial<Play>) {
    return this.repo.save(play);
  }
}
