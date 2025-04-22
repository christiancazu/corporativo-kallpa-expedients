import { EXPEDIENT_TYPE } from '@expedients/shared'
import { SetMetadata } from '@nestjs/common'

export const REQUEST_EXPEDIENT_TYPE = 'expedient:type'

export const SetExpedientType = (type: EXPEDIENT_TYPE) =>
	SetMetadata(REQUEST_EXPEDIENT_TYPE, type)
