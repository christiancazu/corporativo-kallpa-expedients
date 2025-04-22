import { MigrationInterface, QueryRunner } from 'typeorm'

export class MainMigration1745343954703 implements MigrationInterface {
	name = 'MainMigration1740676779540'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TYPE "public"."log_type" AS ENUM('POST', 'PUT', 'DELETE', 'PATCH', 'NOTIFICATION')`,
		)
		await queryRunner.query(
			`CREATE TABLE "logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "log" jsonb, "type" "public"."log_type", "responseStatus" character varying(3), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_fb1b805f2f7795de79fa69340ba" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "endpoint" character varying(255) NOT NULL, "auth" character varying(32) NOT NULL, "p256dh" character varying(120) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "registerForId" uuid, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "reviews" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "expedientId" uuid, "createdByUserId" uuid, CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TYPE "public"."role" AS ENUM('ADMIN', 'ABOGADO', 'PRACTICANTE')`,
		)
		await queryRunner.query(
			`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(50) NOT NULL, "password" character varying(200), "firstName" character varying(50) NOT NULL, "surname" character varying(50) NOT NULL, "role" "public"."role" NOT NULL DEFAULT 'PRACTICANTE', "avatar" character varying(40), "verifiedAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" text NOT NULL, "isSent" boolean NOT NULL DEFAULT false, "isSeenByLawyer" boolean NOT NULL DEFAULT false, "isSeenByAssistant" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "scheduledAt" TIMESTAMP WITH TIME ZONE NOT NULL, "createdByUserId" uuid, "expedientId" uuid, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TYPE "public"."expedient_type" AS ENUM('Asesoría', 'Procesos judiciales', 'Procesos de investigación')`,
		)
		await queryRunner.query(
			`CREATE TABLE "parts_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying(50) NOT NULL, "expedientType" "public"."expedient_type" array, CONSTRAINT "PK_6b30f5b573f64f946c067f8bed0" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "parts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "typeDescription" character varying(50), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "typeId" uuid, "expedientId" uuid, CONSTRAINT "PK_daa5595bb8933f49ac00c9ebc79" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "expedients_status" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying(50) NOT NULL, CONSTRAINT "PK_fd878eb84eef4052aa911355423" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "matter_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying(50) NOT NULL, "color" character varying(10) NOT NULL, CONSTRAINT "PK_53a965a1c18c99ad9c7cfe54693" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "process_types" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" character varying(50) NOT NULL, CONSTRAINT "PK_ec1f6afa2802c5d6a1fd315aece" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TYPE "public"."expedient_instance" AS ENUM('Primera Instancia', 'Segunda Instancia', 'Casación')`,
		)
		await queryRunner.query(
			`CREATE TABLE "expedients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying(100) NOT NULL, "type" "public"."expedient_type", "procedure" character varying(100), "entity" character varying(100), "court" character varying(100), "statusDescription" character varying(50), "instance" "public"."expedient_instance", "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "processTypeId" uuid, "matterTypeId" uuid, "statusId" uuid, "assignedLawyerId" uuid, "assignedAssistantId" uuid, "createdByUserId" uuid, "updatedByUserId" uuid, CONSTRAINT "PK_7abe96162f1ba6457c851d70f65" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(200) NOT NULL, "key" character varying(36) NOT NULL, "extension" character varying(5) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "expedientId" uuid, "createdByUserId" uuid, "updatedByUserId" uuid, CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`ALTER TABLE "logs" ADD CONSTRAINT "FK_a1196a1956403417fe3a0343390" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "notifications" ADD CONSTRAINT "FK_d5ca38bd8785c407b2ef89987b8" FOREIGN KEY ("registerForId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "reviews" ADD CONSTRAINT "FK_07db4484ee71a2c0e2e90757865" FOREIGN KEY ("expedientId") REFERENCES "expedients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "reviews" ADD CONSTRAINT "FK_7732db81cd05e99f89627c1369e" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "events" ADD CONSTRAINT "FK_02789872ab69af88a63ba5b60b3" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "events" ADD CONSTRAINT "FK_58342130c6e5335d88567a08f21" FOREIGN KEY ("expedientId") REFERENCES "expedients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "parts" ADD CONSTRAINT "FK_2edd74ec1e586047768f7478f39" FOREIGN KEY ("typeId") REFERENCES "parts_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "parts" ADD CONSTRAINT "FK_65bb5f41e52b9d5c7ec34d745d0" FOREIGN KEY ("expedientId") REFERENCES "expedients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "expedients" ADD CONSTRAINT "FK_6cd3348b92e6fece5b24f58f2e1" FOREIGN KEY ("processTypeId") REFERENCES "process_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "expedients" ADD CONSTRAINT "FK_4b24e17b0e8282697be8342e333" FOREIGN KEY ("matterTypeId") REFERENCES "matter_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "expedients" ADD CONSTRAINT "FK_12564efb24882664bbd0f1849b9" FOREIGN KEY ("statusId") REFERENCES "expedients_status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "expedients" ADD CONSTRAINT "FK_11cd426cfb1b3774f2742b1e954" FOREIGN KEY ("assignedLawyerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "expedients" ADD CONSTRAINT "FK_b51eafd40a0d8a89db89301f97f" FOREIGN KEY ("assignedAssistantId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "expedients" ADD CONSTRAINT "FK_f473e6e1987f82b037355bb21e4" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "expedients" ADD CONSTRAINT "FK_0b89a8479dce6e47392e355ea35" FOREIGN KEY ("updatedByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "documents" ADD CONSTRAINT "FK_e476eed2ff8ec848a7babe5606a" FOREIGN KEY ("expedientId") REFERENCES "expedients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "documents" ADD CONSTRAINT "FK_b7ad0f73094b5d9ecdebe5bf023" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "documents" ADD CONSTRAINT "FK_88c7d8d1c5b4e88748f14acdab5" FOREIGN KEY ("updatedByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "documents" DROP CONSTRAINT "FK_88c7d8d1c5b4e88748f14acdab5"`,
		)
		await queryRunner.query(
			`ALTER TABLE "documents" DROP CONSTRAINT "FK_b7ad0f73094b5d9ecdebe5bf023"`,
		)
		await queryRunner.query(
			`ALTER TABLE "documents" DROP CONSTRAINT "FK_e476eed2ff8ec848a7babe5606a"`,
		)
		await queryRunner.query(
			`ALTER TABLE "expedients" DROP CONSTRAINT "FK_0b89a8479dce6e47392e355ea35"`,
		)
		await queryRunner.query(
			`ALTER TABLE "expedients" DROP CONSTRAINT "FK_f473e6e1987f82b037355bb21e4"`,
		)
		await queryRunner.query(
			`ALTER TABLE "expedients" DROP CONSTRAINT "FK_b51eafd40a0d8a89db89301f97f"`,
		)
		await queryRunner.query(
			`ALTER TABLE "expedients" DROP CONSTRAINT "FK_11cd426cfb1b3774f2742b1e954"`,
		)
		await queryRunner.query(
			`ALTER TABLE "expedients" DROP CONSTRAINT "FK_12564efb24882664bbd0f1849b9"`,
		)
		await queryRunner.query(
			`ALTER TABLE "expedients" DROP CONSTRAINT "FK_4b24e17b0e8282697be8342e333"`,
		)
		await queryRunner.query(
			`ALTER TABLE "expedients" DROP CONSTRAINT "FK_6cd3348b92e6fece5b24f58f2e1"`,
		)
		await queryRunner.query(
			`ALTER TABLE "parts" DROP CONSTRAINT "FK_65bb5f41e52b9d5c7ec34d745d0"`,
		)
		await queryRunner.query(
			`ALTER TABLE "parts" DROP CONSTRAINT "FK_2edd74ec1e586047768f7478f39"`,
		)
		await queryRunner.query(
			`ALTER TABLE "events" DROP CONSTRAINT "FK_58342130c6e5335d88567a08f21"`,
		)
		await queryRunner.query(
			`ALTER TABLE "events" DROP CONSTRAINT "FK_02789872ab69af88a63ba5b60b3"`,
		)
		await queryRunner.query(
			`ALTER TABLE "reviews" DROP CONSTRAINT "FK_7732db81cd05e99f89627c1369e"`,
		)
		await queryRunner.query(
			`ALTER TABLE "reviews" DROP CONSTRAINT "FK_07db4484ee71a2c0e2e90757865"`,
		)
		await queryRunner.query(
			`ALTER TABLE "notifications" DROP CONSTRAINT "FK_d5ca38bd8785c407b2ef89987b8"`,
		)
		await queryRunner.query(
			`ALTER TABLE "logs" DROP CONSTRAINT "FK_a1196a1956403417fe3a0343390"`,
		)
		await queryRunner.query(`DROP TABLE "documents"`)
		await queryRunner.query(`DROP TABLE "expedients"`)
		await queryRunner.query(`DROP TYPE "public"."expedient_instance"`)
		await queryRunner.query(`DROP TYPE "public"."expedient_type"`)
		await queryRunner.query(`DROP TABLE "process_types"`)
		await queryRunner.query(`DROP TABLE "matter_types"`)
		await queryRunner.query(`DROP TABLE "expedients_status"`)
		await queryRunner.query(`DROP TABLE "parts"`)
		await queryRunner.query(`DROP TABLE "parts_types"`)
		await queryRunner.query(`DROP TABLE "events"`)
		await queryRunner.query(`DROP TABLE "users"`)
		await queryRunner.query(`DROP TYPE "public"."role"`)
		await queryRunner.query(`DROP TABLE "reviews"`)
		await queryRunner.query(`DROP TABLE "notifications"`)
		await queryRunner.query(`DROP TABLE "logs"`)
		await queryRunner.query(`DROP TYPE "public"."log_type"`)
	}
}
