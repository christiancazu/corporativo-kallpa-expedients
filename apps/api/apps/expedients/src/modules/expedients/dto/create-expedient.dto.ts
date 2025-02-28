import { EXPEDIENT_STATUS, FIELD } from '@expedients/shared'
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
import { EsUsuarioGrupoNombre } from '../validators/test.validator'

export class CreateExpedientDto {
	@IsNotEmpty()
	@MaxLength(FIELD.EXPEDIENT_CODE_MAX_LENGTH)
	code: string

	@IsNotEmpty()
	@IsString()
	@MaxLength(FIELD.EXPEDIENT_SUBJECT_MAX_LENGTH)
	subject: string

	@IsString()
	@MaxLength(FIELD.EXPEDIENT_ENTITY_MAX_LENGTH)
	@EsUsuarioGrupoNombre()
	entity?: string

	@IsUUID()
	@EsUsuarioGrupoNombre()
	processTypeId?: string

	@IsNotEmpty()
	@IsString()
	@MaxLength(FIELD.EXPEDIENT_COURT_MAX_LENGTH)
	court: string

	@IsOptional()
	@IsEnum(EXPEDIENT_STATUS)
	status?: EXPEDIENT_STATUS

	@IsOptional()
	@IsString()
	statusDescription?: string

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
