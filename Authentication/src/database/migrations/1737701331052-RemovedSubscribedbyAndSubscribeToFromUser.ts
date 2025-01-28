import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovedSubscribedbyAndSubscribeToFromUser1737701331052 implements MigrationInterface {
    name = 'RemovedSubscribedbyAndSubscribeToFromUser1737701331052'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`subscribedBy\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`subscribedTo\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`subscribedTo\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`subscribedBy\` text NULL`);
    }

}
