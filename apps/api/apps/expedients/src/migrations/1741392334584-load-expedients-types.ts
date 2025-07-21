import { MigrationInterface, QueryRunner } from 'typeorm'

const initialExpedientStatus = [
  'Demanda',
  'Inadmisible',
  'Auto admisorio',
  'Contestación de demanda',
  'Saneado',
  'Fijación puntos controvertidos',
  'Saneamiento probatorio',
  'Sentencia',
  'Apelación',
  'Casación',
  'Ejecución',
  'Etapa conciliatoria',
  'Otros',
]

export class LoadExpedientsTypes1741392334584 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for await (const record of initialExpedientStatus) {
      await queryRunner.query(
        `INSERT INTO "public"."expedients_status" (description) VALUES ('${record}')`,
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for await (const status of initialExpedientStatus) {
      await queryRunner.query(
        `DELETE FROM "public"."expedients_status" WHERE description = '${status}'`,
      )
    }
  }
}
