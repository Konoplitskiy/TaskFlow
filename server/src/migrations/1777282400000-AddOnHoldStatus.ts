import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOnHoldStatus1777282400000 implements MigrationInterface {
    name = 'AddOnHoldStatus1777282400000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."tasks_status_enum" ADD VALUE IF NOT EXISTS 'on_hold'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Postgres cannot easily remove enum values; no-op for down.
    }
}
