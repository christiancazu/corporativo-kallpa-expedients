import { OmitType, PartialType } from '@nestjs/mapped-types'
import { Type } from 'class-transformer'
import { IsArray, IsOptional, ValidateNested } from 'class-validator'
import { UpdatePartDto } from '../../parts/dto/update-part.dto'
import { CreateExpedientDto } from './create-expedient.dto'

export class UpdateExpedientDto extends PartialType(
	OmitType(CreateExpedientDto, ['parts']),
) {
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => UpdatePartDto)
	parts: UpdatePartDto[]
}
