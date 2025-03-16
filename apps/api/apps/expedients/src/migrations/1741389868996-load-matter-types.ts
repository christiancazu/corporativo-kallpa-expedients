import { MigrationInterface, QueryRunner } from 'typeorm'

export class LoadMatterTypes1741389868996 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const initialMatterTypes = {
			Laboral: 'purple',
			Civil: 'green',
			Penal: 'geekblue',
			Adminitrativo: 'orange',
			Familia: 'pink',
			Constitucional: 'cyan',
			Tributario: 'yellow',
		}

		for await (const record of Object.keys(initialMatterTypes)) {
			await queryRunner.query(
				`INSERT INTO "public"."matter_types" (description, color) VALUES ($1, $2)`,
				[record, initialMatterTypes[record as keyof typeof initialMatterTypes]],
			)
		}
	}

	public async down(queryRunner: QueryRunner): Promise<void> {}
}
