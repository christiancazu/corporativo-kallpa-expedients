import { IsEnum, IsNotEmpty, IsObject, IsOptional } from 'class-validator'
import { LOG_ACTION } from '../enums'

export class CreateLogDto {
	@IsOptional()
	@IsEnum(LOG_ACTION)
	action: LOG_ACTION

	@IsNotEmpty()
	userId: string

	@IsObject()
	log: any
}

export class UpdateLogDto {
	@IsNotEmpty()
	id: string

	@IsOptional()
	responseStatus?: string
}
