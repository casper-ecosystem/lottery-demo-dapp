import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoundsView1713372155154 implements MigrationInterface {
  name = 'CreateRoundsView1713372155154';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE OR REPLACE VIEW rounds AS
            select 
                p.round_id, 
                w.plays_num, 
                p.jackpot_amount, 
                p.player_account_hash as winner_account_hash,
                last_play.deploy_hash as last_play_deploy_hash,
                p.timestamp as ended_at 
            from plays p
            join (
                select max(play_id) as play_id,
                max(is_jackpot) as is_finished,
                count(*) as plays_num
                from plays 
                group by round_id
            ) w on w.play_id = p.play_id
            join plays last_play on last_play.play_id = p.play_id;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP VIEW rounds;
        `);
  }
}
