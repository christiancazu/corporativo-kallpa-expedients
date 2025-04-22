import { IFindExpedientDto } from '@expedients/shared'
import { IsOptional } from 'class-validator'
import { PaginationOptionsDto } from '../../shared/pagination/dto/pagination.dto'
import { ValidateExpedientStatus } from '../validators/expedient-status.validator'

export class FindExpedientDto
	extends PaginationOptionsDto
	implements IFindExpedientDto
{
	@IsOptional()
	text?: string

	@IsOptional()
	updatedByUser?: string

	@IsOptional()
	matterType?: string

	@IsOptional()
	@ValidateExpedientStatus('description')
	status?: string
}
