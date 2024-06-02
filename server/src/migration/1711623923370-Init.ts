import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1711623923370 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
			create table if not exists plays (
					deploy_hash         varchar(64)          NOT NULL,
					round_id            bigint(20) UNSIGNED  NOT NULL,
					play_id             bigint(20) UNSIGNED  NOT NULL,
					player_account_hash varchar(64)          NOT NULL,
					prize_amount        varchar(128)         NOT NULL,
					is_jackpot          bool                 NOT NULL,
					timestamp           datetime             NOT NULL,

					PRIMARY KEY (play_id),
					KEY round_id_idx (round_id),
					KEY player_account_hash_idx (player_account_hash)
			) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
		`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
			drop table if exists plays;
		`);
  }
}
