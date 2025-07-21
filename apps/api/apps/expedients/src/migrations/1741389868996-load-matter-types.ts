import { MigrationInterface, QueryRunner } from 'typeorm'

const initialMatterTypes = {
  Laboral: 'purple',
  Civil: 'green',
  Penal: 'geekblue',
  Adminitrativo: 'orange',
  Familia: 'pink',
  Constitucional: 'cyan',
  Tributario: 'yellow',
}

export class LoadMatterTypes1741389868996 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    for await (const record of Object.keys(initialMatterTypes)) {
      await queryRunner.query(
        `INSERT INTO "public"."matter_types" (description, color) VALUES ($1, $2)`,
        [record, initialMatterTypes[record as keyof typeof initialMatterTypes]],
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for await (const matterType of Object.keys(initialMatterTypes)) {
      await queryRunner.query(
        `DELETE FROM "public"."matter_types" WHERE description = $1`,
        [matterType],
      )
    }
  }
}
