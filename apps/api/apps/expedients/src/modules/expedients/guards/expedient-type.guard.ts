import { EXPEDIENT_TYPE } from '@expedients/shared'
import { CanActivate, ExecutionContext, UseGuards } from '@nestjs/common'

export const REQUEST_EXPEDIENT_TYPE = 'x-expedient-type'

export const SetExpedientType = (type: EXPEDIENT_TYPE) => {
	class ExpedientType implements CanActivate {
		canActivate(context: ExecutionContext): boolean {
			const request = context.switchToHttp().getRequest()
			request.headers[REQUEST_EXPEDIENT_TYPE] = type

			return true
		}
	}

	return UseGuards(ExpedientType)
}
