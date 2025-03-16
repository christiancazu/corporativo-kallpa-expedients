import { MigrationInterface, QueryRunner } from 'typeorm'

export class LoadProcessTypes1740676779541 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const initialProcessTypes = [
			'Conocimiento',
			'Abreviado',
			'Sumarísimo',
			'Colegiado',
			'Unipersonal',
			'Investigación preparatoria',
			'Proceso único de Ejecución',
			'Ejecución de garantías',
		]

		for await (const record of initialProcessTypes) {
			await queryRunner.query(
				`INSERT INTO "public"."process_types" (description) VALUES ('${record}')`,
			)
		}
	}

	public async down(queryRunner: QueryRunner): Promise<void> {}
}
