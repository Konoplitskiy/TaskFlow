import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProject1777282313881 implements MigrationInterface {
    name = 'CreateProject1777282313881'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_managers" ("projectId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_183cac0fe2f3989b8bf7875489a" PRIMARY KEY ("projectId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_03e8306494e8d5054fe5cb53df" ON "project_managers" ("projectId") `);
        await queryRunner.query(`CREATE INDEX "IDX_454135ad73f062c579ad67c5ef" ON "project_managers" ("userId") `);
        await queryRunner.query(`CREATE TABLE "project_users" ("projectId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_180c5df4197aae759c30784f7e1" PRIMARY KEY ("projectId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1905d9d76173d09c07ba1f0cd8" ON "project_users" ("projectId") `);
        await queryRunner.query(`CREATE INDEX "IDX_6ebc83af455ff1ed9573c823e2" ON "project_users" ("userId") `);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "projectId" uuid`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_e08fca67ca8966e6b9914bf2956" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_managers" ADD CONSTRAINT "FK_03e8306494e8d5054fe5cb53dff" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_managers" ADD CONSTRAINT "FK_454135ad73f062c579ad67c5ef6" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_users" ADD CONSTRAINT "FK_1905d9d76173d09c07ba1f0cd84" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_users" ADD CONSTRAINT "FK_6ebc83af455ff1ed9573c823e23" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_users" DROP CONSTRAINT "FK_6ebc83af455ff1ed9573c823e23"`);
        await queryRunner.query(`ALTER TABLE "project_users" DROP CONSTRAINT "FK_1905d9d76173d09c07ba1f0cd84"`);
        await queryRunner.query(`ALTER TABLE "project_managers" DROP CONSTRAINT "FK_454135ad73f062c579ad67c5ef6"`);
        await queryRunner.query(`ALTER TABLE "project_managers" DROP CONSTRAINT "FK_03e8306494e8d5054fe5cb53dff"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_e08fca67ca8966e6b9914bf2956"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "projectId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6ebc83af455ff1ed9573c823e2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1905d9d76173d09c07ba1f0cd8"`);
        await queryRunner.query(`DROP TABLE "project_users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_454135ad73f062c579ad67c5ef"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_03e8306494e8d5054fe5cb53df"`);
        await queryRunner.query(`DROP TABLE "project_managers"`);
        await queryRunner.query(`DROP TABLE "projects"`);
    }

}
