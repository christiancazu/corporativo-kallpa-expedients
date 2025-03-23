import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { tap } from 'rxjs'
import { AlsService } from '../../shared/als/als.service'
import { LogsService } from '../logs.service'

export class LogRequestInterceptor implements NestInterceptor {
	constructor(
		private readonly _logsService: LogsService,
		private readonly _alsService: AlsService,
	) {}

	async intercept(context: ExecutionContext, next: CallHandler) {
		const { body, url, user, method, route, ...res } = context
			.switchToHttp()
			.getRequest().res.req

		const isPublicRoute = Reflect.getMetadata('isPublic', context.getClass())

		if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && !isPublicRoute) {
			await this._logsService.create({
				log: {
					body,
					url,
				},
				userId: user.id,
				action: method,
			})
		}

		return next.handle().pipe(
			tap({
				complete: () => {
					const id = this._alsService.get<string>(
						'log:currentRequestLogId',
					) as string

					if (id) {
						const responseStatus = context.getArgs()[0].res.statusCode

						this._logsService.update({
							id,
							responseStatus,
						})
					}
				},
				error: (err) => {
					const id = this._alsService.get<string>(
						'log:currentRequestLogId',
					) as string

					if (id) {
						this._logsService.update({
							id,
							responseStatus: err.status ?? '500',
						})
					}
				},
			}),
		)
	}
}
