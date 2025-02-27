import { registerAs } from '@nestjs/config'
import { DataSource, type DataSourceOptions } from 'typeorm'
import { Document } from '../documents/entities/document.entity'
import { Event } from '../events/entities/event.entity'
import { Expedient } from '../expedients/entities/expedient.entity'
import { Notification } from '../notifications/entities/notification.entity'
import { Part } from '../parts/entities/part.entity'
import { Review } from '../reviews/entities/review.entity'
import { User } from '../users/entities/user.entity'

import './dotenv'
import { ProcessType } from '../expedients/process-types/entities/process-types.entity'

const config: DataSourceOptions = {
	type: 'postgres',
	host: process.env.POSTGRES_HOST,
	port: +`${process.env.POSTGRES_PORT}`,
	username: process.env.POSTGRES_USERNAME,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DATABASE,
	entities: [
		User,
		Document,
		Part,
		Review,
		Expedient,
		Event,
		Notification,
		ProcessType,
	],
	migrations: [`${__dirname}../../../migrations/*{.ts,.js}`],
	synchronize: process.env.POSTGRES_SYNC === 'true',
	migrationsTableName: 'migrations',
}

export const typeormConfig = registerAs('typeorm', () => config)

export default new DataSource(config)
