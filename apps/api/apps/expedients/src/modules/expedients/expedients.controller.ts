import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common'
import { User } from '../users/entities/user.entity'
import { UserRequest } from '../users/user-request.decorator'
import { FindExpedientDto } from './dto/find-expedient.dto'
import { Expedient } from './entities/expedient.entity'
import { ExpedientsService } from './expedients.service'

@Controller('expedients')
export class ExpedientsController {
	constructor(private readonly expedientsService: ExpedientsService) {}

	@Get('events')
	findEvents(@UserRequest() user: User) {
		return this.expedientsService.findEvents(user)
	}
}

export class ExpedientTypeBaseController {
	constructor(readonly expedientsService: ExpedientsService) {}

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
}

export interface IExpedientTypeBaseController<C, U> {
	create(dto: C, user: User): Promise<Expedient>

	update(id: string, dto: U, user: User): Promise<Expedient>
}
