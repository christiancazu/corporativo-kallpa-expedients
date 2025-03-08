import { MigrationInterface, QueryRunner } from 'typeorm'

export class LoadMatterTypes1741389868996 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const initialMatterTypes = [
			'laboral',
			'Civil',
			'Penal',
			'Adminitrativo',
			'Familia',
			'Constiucional',
			'Tributario',
		]

		for await (const record of initialMatterTypes) {
			await queryRunner.query(
				`INSERT INTO "public"."matter_types" (description) VALUES ('${record}')`,
			)
		}
	}

	public async down(queryRunner: QueryRunner): Promise<void> {}
}
