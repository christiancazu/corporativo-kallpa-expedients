import { EXPEDIENT_TYPE } from '@expedients/shared'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class LoadPartTypes1741567617432 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const initialPartTypes = {
      Agraviado: [
        EXPEDIENT_TYPE.INVESTIGATION_PROCESSES,
        EXPEDIENT_TYPE.JUDICIAL_PROCESSES,
      ],
      Investigado: [EXPEDIENT_TYPE.INVESTIGATION_PROCESSES],
      Imputado: [EXPEDIENT_TYPE.JUDICIAL_PROCESSES],
      Demandante: [EXPEDIENT_TYPE.JUDICIAL_PROCESSES],
      Demandado: [EXPEDIENT_TYPE.JUDICIAL_PROCESSES],
    }

    for await (const record of Object.keys(initialPartTypes)) {
      await queryRunner.query(
        `INSERT INTO "public"."parts_types" (description, "expedientType") VALUES ('${record}', ARRAY[${initialPartTypes[record as keyof typeof initialPartTypes].map((p) => `'${p}'`).join(',')}]::expedient_type[])`,
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const partTypesToDelete = [
      'Agraviado',
      'Investigado',
      'Imputado',
      'Demandante',
      'Demandado',
    ]

    for await (const partType of partTypesToDelete) {
      await queryRunner.query(
        `DELETE FROM "public"."parts_types" WHERE description = '${partType}'`,
      )
    }
  }
}
