import { FIELD, ICreatePartDto } from '@expedients/shared'
import { IsNotEmpty, IsUUID, MaxLength, ValidateIf } from 'class-validator'

export class CreatePartDto implements ICreatePartDto {
	@IsNotEmpty()
	@MaxLength(FIELD.PART_NAME_MAX_LENGTH)
	name: string

	@ValidateIf((o) => !o.typeDescription)
	@IsUUID()
	typeId: string

	@ValidateIf((o) => !o.type)
	@MaxLength(FIELD.PART_TYPE_DESCRIPTION_MAX_LENGTH)
	typeDescription: string
}
