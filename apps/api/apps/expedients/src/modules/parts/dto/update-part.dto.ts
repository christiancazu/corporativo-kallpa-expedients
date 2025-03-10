import { PartialType } from '@nestjs/mapped-types'
import { IsOptional, IsUUID } from 'class-validator'
import { CreatePartDto } from './create-part.dto'

export class UpdatePartDto extends PartialType(CreatePartDto) {
	@IsOptional()
	@IsUUID()
	id: string
}
