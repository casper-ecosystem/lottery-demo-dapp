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

  save(play: Play) {
    return this.repo.save(play);
  }
}
