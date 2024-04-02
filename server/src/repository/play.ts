import { DataSource, Repository } from 'typeorm';
import { Play } from '../entity/play.entity';

export class PlayRepository {
  private repo: Repository<Play>;
  constructor(private dataSource: DataSource) {
    this.repo = dataSource.getRepository(Play);
  }

  findAll() {
    return this.repo.find({});
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

  save(play: Play) {
    return this.repo.save(play);
  }
}
