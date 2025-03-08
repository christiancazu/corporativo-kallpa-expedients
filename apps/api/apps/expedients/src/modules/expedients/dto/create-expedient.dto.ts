import { FIELD, JUDICIAL_PROCESSES_INSTANCES } from '@expedients/shared'
import { Type } from 'class-transformer'
import {
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
	MaxLength,
	ValidateNested,
} from 'class-validator'
import { CreatePartDto } from '../../parts/dto/create-part.dto'
import { ValidateExpedientStatus } from '../validators/expedient-status.validator'
import { ValidateExpedientType } from '../validators/expedient-type.validator'
import { ValidateMatterType } from '../validators/matter-type.validator'

export class CreateExpedientDto {
	@IsNotEmpty()
	@MaxLength(FIELD.EXPEDIENT_CODE_MAX_LENGTH)
	code: string

	@IsNotEmpty()
	@IsString()
	@MaxLength(FIELD.EXPEDIENT_PROCEDURE_MAX_LENGTH)
	procedure?: string

	@IsString()
	@MaxLength(FIELD.EXPEDIENT_ENTITY_MAX_LENGTH)
	@ValidateExpedientType()
	entity?: string

	@ValidateExpedientType()
	@MaxLength(FIELD.EXPEDIENT_COURT_MAX_LENGTH)
	court: string

	@IsUUID()
	@ValidateExpedientType()
	processTypeId?: string

	@IsUUID()
	@ValidateMatterType('id')
	matterTypeId?: string

	@IsUUID()
	@ValidateExpedientStatus('id')
	statusId?: string

	@IsOptional()
	@IsString()
	statusDescription?: string

	@ValidateExpedientType()
	@IsOptional()
	@IsEnum(JUDICIAL_PROCESSES_INSTANCES)
	instance?: JUDICIAL_PROCESSES_INSTANCES

	@IsOptional()
	@IsUUID()
	assignedLawyerId: string

	@IsOptional()
	@IsUUID()
	assignedAssistantId: string

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreatePartDto)
	parts: CreatePartDto[]
}
