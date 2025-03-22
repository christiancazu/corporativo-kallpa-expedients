import { join } from 'node:path'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { type MicroserviceOptions, Transport } from '@nestjs/microservices'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { MessengerModule } from 'apps/messenger/src/messenger.module'
import { useContainer } from 'class-validator'
import { AppModule } from './app.module'
import { AlsService } from './modules/global/als/als.service'
import { LogRequestInterceptor } from './modules/logs/interceptors/log-request.interceptor'
import { LogsService } from './modules/logs/logs.service'

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule)

	useContainer(app.select(AppModule), { fallbackOnErrors: true })

	if (process.env.NODE_ENV === 'development') {
		app.enableCors()
	}
	app.setGlobalPrefix('api')

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
		}),
	)

	const path = app.get(ConfigService).get('path')

	app.useStaticAssets(join(path.root, path.media), {
		prefix: path.media,
		index: false,
	})

	app.useGlobalInterceptors(
		new LogRequestInterceptor(app.get(LogsService), app.get(AlsService)),
	)

	const port = app.get(ConfigService).get('APP_PORT')

	await app.listen(port, () => console.log(`server on PORT: ${port}`))
}

async function bootstrapMessenger() {
	const app = await NestFactory.create(MessengerModule)

	const port = app.get(ConfigService).get('MESSENGER_PORT')

	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.TCP,
		options: {
			port,
		},
	})

	await app.startAllMicroservices()
	await app.init()
}
;(async () => {
	bootstrap()
	bootstrapMessenger()
})()
