import { OmitType, PartialType } from '@nestjs/mapped-types'
import { Type } from 'class-transformer'
import { IsArray, IsOptional, ValidateNested } from 'class-validator'
import { UpdatePartDto } from '../../parts/dto/update-part.dto'
import {
	CreateExpedientConsultancyDto,
	CreateExpedientInvestigationProcessesDto,
	CreateExpedientJudicialProcessesDto,
} from './create-expedient.dto'

export class UpdateExpedientConsultancyDto extends PartialType(
	OmitType(CreateExpedientConsultancyDto, ['parts']),
) {
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => UpdatePartDto)
	parts: UpdatePartDto[]
}

export class UpdateExpedientJudicialProcessesDto extends PartialType(
	OmitType(CreateExpedientJudicialProcessesDto, ['parts']),
) {
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => UpdatePartDto)
	parts: UpdatePartDto[]
}

export class UpdateExpedientInvestigationProcessesDto extends PartialType(
	OmitType(CreateExpedientInvestigationProcessesDto, ['parts']),
) {
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => UpdatePartDto)
	parts: UpdatePartDto[]
}
