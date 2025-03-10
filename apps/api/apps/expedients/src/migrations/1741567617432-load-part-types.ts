import { EXPEDIENT_TYPE } from '@expedients/shared'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class LoadPartTypes1741567617432 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const initialPartTypes = {
			AGRAVIADO: [
				EXPEDIENT_TYPE.INVESTIGATION_PROCESSES,
				EXPEDIENT_TYPE.JUDICIAL_PROCESSES,
			],
			INVESTIGADO: [
				EXPEDIENT_TYPE.INVESTIGATION_PROCESSES,
				EXPEDIENT_TYPE.JUDICIAL_PROCESSES,
			],
			IMPUTADO: [EXPEDIENT_TYPE.JUDICIAL_PROCESSES],
			DEMANDANTE: [EXPEDIENT_TYPE.JUDICIAL_PROCESSES],
			DEMANDADO: [EXPEDIENT_TYPE.JUDICIAL_PROCESSES],
		}

		for await (const record of Object.keys(initialPartTypes)) {
			await queryRunner.query(
				`INSERT INTO "public"."parts_types" (description, "expedientType") VALUES ('${record}', ARRAY[${initialPartTypes[record as keyof typeof initialPartTypes].map((p) => `'${p}'`).join(',')}]::expedient_type[])`,
			)
		}
	}

	public async down(queryRunner: QueryRunner): Promise<void> {}
}
