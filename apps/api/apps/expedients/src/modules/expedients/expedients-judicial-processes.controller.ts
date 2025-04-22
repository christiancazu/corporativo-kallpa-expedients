import { EXPEDIENT_TYPE } from '@expedients/shared'
import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
} from '@nestjs/common'
import { User } from '../users/entities/user.entity'
import { UserRequest } from '../users/user-request.decorator'
import { SetExpedientType } from './decorators/set-expedient-type.decorator'
import { CreateExpedientJudicialProcessesDto } from './dto/create-expedient.dto'
import { UpdateExpedientJudicialProcessesDto } from './dto/update-expedient.dto'
import {
	ExpedientTypeBaseController,
	IExpedientTypeBaseController,
} from './expedients.controller'
import { ExpedientsService } from './expedients.service'

@Controller('judicial-processes')
@SetExpedientType(EXPEDIENT_TYPE.JUDICIAL_PROCESSES)
export class ExpedientsJudicialProcessesController
	extends ExpedientTypeBaseController
	implements
		IExpedientTypeBaseController<
			CreateExpedientJudicialProcessesDto,
			UpdateExpedientJudicialProcessesDto
		>
{
	constructor(readonly expedientsService: ExpedientsService) {
		super(expedientsService)
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(
		@Body() dto: CreateExpedientJudicialProcessesDto,
		@UserRequest() user: User,
	) {
		return this.expedientsService.create(user, dto as any)
	}

	@Patch(':id')
	update(
		@Param('id', new ParseUUIDPipe()) id: string,
		@Body() dto: UpdateExpedientJudicialProcessesDto,
		@UserRequest() user: User,
	) {
		return this.expedientsService.update(user, dto as any, id)
	}
}
