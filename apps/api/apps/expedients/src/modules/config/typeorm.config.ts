import { registerAs } from '@nestjs/config'
import { DataSource, type DataSourceOptions } from 'typeorm'
import { Document } from '../documents/entities/document.entity'
import { Event } from '../events/entities/event.entity'
import { Expedient } from '../expedients/entities/expedient.entity'
import { ExpedientStatus } from '../expedients/modules/expedient-status/entities/expedient-status.entity'
import { MatterType } from '../expedients/modules/matter-types/entities/matter-types.entity'
import { ProcessType } from '../expedients/modules/process-types/entities/process-types.entity'
import { Log } from '../logs/entitities/log.entity'
import { Notification } from '../notifications/entities/notification.entity'
import { Part } from '../parts/entities/part.entity'
import { PartType } from '../parts/modules/part-types/entities/part-types.entity'
import { Review } from '../reviews/entities/review.entity'
import { User } from '../users/entities/user.entity'

import './dotenv'

const config: DataSourceOptions = {
	type: 'postgres',
	host: process.env.POSTGRES_HOST,
	port: +`${process.env.POSTGRES_PORT}`,
	username: process.env.POSTGRES_USERNAME,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DATABASE,
	entities: [
		User,
		Expedient,
		Document,
		Part,
		PartType,
		Review,
		Event,
		Notification,
		ProcessType,
		MatterType,
		ExpedientStatus,
		Log,
	],
	migrations: [`${__dirname}../../../migrations/*{.ts,.js}`],
	synchronize: false,
	migrationsTableName: 'migrations',
}

export const typeormConfig = registerAs('typeorm', () => config)

export default new DataSource(config)
