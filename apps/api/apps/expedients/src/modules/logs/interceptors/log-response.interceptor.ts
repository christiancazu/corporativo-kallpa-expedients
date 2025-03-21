import {
	CallHandler,
	ExecutionContext,
	HttpException,
	NestInterceptor,
} from '@nestjs/common'
import { throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { AlsService } from '../../global/als/als.service'
import { LogsService } from '../logs.service'

export class LogResponseInterceptor implements NestInterceptor {
	constructor(
		private readonly _logsService: LogsService,
		private readonly _alsService: AlsService,
	) {}

	async intercept(context: ExecutionContext, next: CallHandler) {
		return next.handle().pipe(
			catchError((err) => {
				const id = this._alsService.get<string>(
					'log:currentRequestLogId',
				) as string

				if (id) {
					this._logsService.update({
						id,
						responseStatus: err.status as string,
					})
				}

				return throwError(() => new HttpException(err.response, err.status))
			}),
		)
	}
}
