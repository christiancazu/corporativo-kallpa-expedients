import { MigrationInterface, QueryRunner } from "typeorm";

export class First1738113453206 implements MigrationInterface {
    name = 'First1738113453206'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."part_type" AS ENUM('DENUNCIANTE', 'DENUNCIADO', 'DEMANDANTE', 'DEMANDADO')`);
        await queryRunner.query(`ALTER TABLE "parts" ADD "type" "public"."part_type"`);
        await queryRunner.query(`CREATE TYPE "public"."expedient_type" AS ENUM('EMPRESA', 'ASESORIA')`);
        await queryRunner.query(`ALTER TABLE "expedients" ADD "type" "public"."expedient_type" NOT NULL DEFAULT 'EMPRESA'`);
        await queryRunner.query(`CREATE TYPE "public"."status" AS ENUM('DEMANDA', 'INADMISIBLE', 'AUTO EMISARIO', 'CONTESTACIÓN DE DEMANDA', 'SANEADO', 'FIJACIÓN PUNTOS CONTROVERTIDOS', 'SANEAMIENTO PROBATORIO', 'SENTENCIA', 'APELACIÓN', 'CASACIÓN', 'EN EJECUCIÓN')`);
        await queryRunner.query(`ALTER TABLE "expedients" ADD "status" "public"."status" NOT NULL DEFAULT 'EN EJECUCIÓN'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expedients" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."status"`);
        await queryRunner.query(`ALTER TABLE "expedients" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."expedient_type"`);
        await queryRunner.query(`ALTER TABLE "parts" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."part_type"`);
    }

}
