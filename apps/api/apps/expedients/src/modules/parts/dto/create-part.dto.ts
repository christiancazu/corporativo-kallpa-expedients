import { FIELD, ICreatePartDto, PART_TYPES } from '@expedients/shared'
import {
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsUUID,
	MaxLength,
	ValidateIf,
} from 'class-validator'

export class CreatePartDto implements ICreatePartDto {
	@IsNotEmpty()
	@MaxLength(FIELD.PART_NAME_MAX_LENGTH)
	name: string

	@ValidateIf((o) => !o.typeDescription)
	@IsEnum(PART_TYPES)
	type: PART_TYPES

	@ValidateIf((o) => !o.type)
	@MaxLength(FIELD.PART_TYPE_DESCRIPTION_MAX_LENGTH)
	typeDescription: string

	@IsOptional()
	@IsUUID()
	id: string
}
