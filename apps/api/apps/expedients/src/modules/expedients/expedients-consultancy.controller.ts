import { EXPEDIENT_TYPE } from '@expedients/shared'
import {
	Body,
	Controller,
	Get,
	HttpCode,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
} from '@nestjs/common'
import { User } from '../users/entities/user.entity'
import { UserRequest } from '../users/user-request.decorator'
import { CreateExpedientDto } from './dto/create-expedient.dto'
import { FindExpedientDto } from './dto/find-expedient.dto'
import { UpdateExpedientDto } from './dto/update-expedient.dto'
import { ExpedientsService } from './expedients.service'
import { SetExpedientType } from './guards/expedient-type.guard'

@Controller('consultancy')
@SetExpedientType(EXPEDIENT_TYPE.CONSULTANCY)
export class ExpedientsConsultancyController {
	constructor(private readonly expedientsService: ExpedientsService) {}

	@Post()
	@HttpCode(201)
	create(@Body() dto: CreateExpedientDto, @UserRequest() user: User) {
		const { processTypeId, court, instance, ...availableFieldsDto } = dto

		return this.expedientsService.create(user, availableFieldsDto)
	}

	@Get()
	findAll(@Query() query: FindExpedientDto) {
		return this.expedientsService.findAll(query)
	}

	@Get('events')
	findEvents(@UserRequest() user: User) {
		return this.expedientsService.findEvents(user)
	}

	@Get(':id/events')
	findByIdEvents(@Param('id', new ParseUUIDPipe()) id: string) {
		return this.expedientsService.findByIdEvents(id)
	}

	@Get(':id')
	findOne(@Param('id', new ParseUUIDPipe()) id: string) {
		return this.expedientsService.findOne(id)
	}

	@Patch(':id')
	update(
		@Param('id', new ParseUUIDPipe()) id: string,
		@Body() dto: UpdateExpedientDto,
		@UserRequest() user: User,
	) {
		const { processTypeId, court, instance, ...availableFieldsDto } = dto

		return this.expedientsService.update(user, availableFieldsDto, id)
	}
}
