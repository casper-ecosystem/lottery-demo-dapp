import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoundsView1713372155154 implements MigrationInterface {
  name = 'CreateRoundsView1713372155154';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE OR REPLACE VIEW rounds AS
            select 
                p.round_id, 
                w.plays_num, 
                p.prize_amount as jackpot_amount, 
                p.player_account_hash as winner_account_hash, 
                p.timestamp as ended_at 
            from plays p
            join (
                select max(play_id) as play_id, count(*) as plays_num
                from plays 
                group by round_id
            ) w on w.play_id = p.play_id;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP VIEW rounds;
        `);
  }
}
