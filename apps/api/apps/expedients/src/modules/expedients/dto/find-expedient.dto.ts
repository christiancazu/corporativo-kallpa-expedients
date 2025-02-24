import { EXPEDIENT_STATUS } from '@expedients/shared'
import { IsEnum, IsOptional } from 'class-validator'

export class FindExpedientDto {
	@IsOptional()
	text: string

	@IsOptional()
	updatedByUser: string

	@IsOptional()
	@IsEnum(EXPEDIENT_STATUS)
	status?: EXPEDIENT_STATUS
}
