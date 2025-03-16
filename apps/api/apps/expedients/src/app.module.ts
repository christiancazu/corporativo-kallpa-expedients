import { join } from 'node:path'
import { BullModule } from '@nestjs/bullmq'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import { ServeStaticModule } from '@nestjs/serve-static'
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm'
import { redisStore } from 'cache-manager-redis-store'
import { AuthModule } from './modules/auth/auth.module'
import { AuthGuard } from './modules/auth/guards/auth.guard'
import { AppConfigModule } from './modules/config/app-config.module'
import { DocumentsModule } from './modules/documents/documents.module'
import { EventsModule } from './modules/events/events.module'
import { ExpedientsModule } from './modules/expedients/expedients.module'
import { AlsModule } from './modules/global/als/als.module'
import { NotificationsModule } from './modules/notifications/notifications.module'
import { PartsModule } from './modules/parts/parts.module'
import { ReviewsModule } from './modules/reviews/reviews.module'
import { UsersModule } from './modules/users/users.module'

@Module({
	imports: [
		AppConfigModule,

		ServeStaticModule.forRootAsync({
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => [
				{
					rootPath: join(
						configService.get('path').root,
						'apps/client/dist',
					),
					exclude: ['/api*', '/media*'],
				}
			],
		}),

		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) =>
				configService.get('typeorm') as TypeOrmModuleOptions,
		}),

		BullModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				connection: {
					host: configService.get<string>('REDIS_HOST'),
					port: configService.get<number>('REDIS_PORT'),
				},
				prefix: configService.get<string>('POSTGRES_DATABASE'),
			}),
		}),

		CacheModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			isGlobal: true,
			useFactory: async (configService: ConfigService) => ({
				store: await redisStore({
					socket: {
						host: configService.get<string>('REDIS_HOST'),
						port: configService.get<number>('REDIS_PORT')!,
					},
				}),
			}),
		}),

		ScheduleModule.forRoot(),

		AuthModule,

		UsersModule,

		ExpedientsModule,

		PartsModule,

		ReviewsModule,

		DocumentsModule,

		EventsModule,

		NotificationsModule,

		AlsModule,
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
})
export class AppModule {}
