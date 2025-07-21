import {
  applyDecorators,
  BadRequestException,
  CallHandler,
  ExecutionContext,
  HttpException,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common'
import { throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

export class QueryInvalidFeedbackInterceptor implements NestInterceptor {
  async intercept(_context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      catchError((err) => {
        let customMessage: any

        if (err instanceof BadRequestException) {
          customMessage = err.getResponse()
          customMessage.feedback = 'Los parámetros de busqueda no son correctos'
        }

        return throwError(
          () => new HttpException(customMessage ?? err.message, err.status),
        )
      }),
    )
  }
}

export const SendQueryInvalidFeedback = () =>
  applyDecorators(UseInterceptors(QueryInvalidFeedbackInterceptor))
