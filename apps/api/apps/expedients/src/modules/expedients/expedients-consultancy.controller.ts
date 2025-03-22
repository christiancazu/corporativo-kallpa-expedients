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
import { CreateExpedientConsultancyDto } from './dto/create-expedient.dto'
import { UpdateExpedientConsultancyDto } from './dto/update-expedient.dto'
import {
	ExpedientTypeBaseController,
	IExpedientTypeBaseController,
} from './expedients.controller'
import { ExpedientsService } from './expedients.service'

@Controller('consultancy')
@SetExpedientType(EXPEDIENT_TYPE.CONSULTANCY)
export class ExpedientsConsultancyController
	extends ExpedientTypeBaseController
	implements
		IExpedientTypeBaseController<
			CreateExpedientConsultancyDto,
			UpdateExpedientConsultancyDto
		>
{
	constructor(readonly expedientsService: ExpedientsService) {
		super(expedientsService)
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(
		@Body() dto: CreateExpedientConsultancyDto,
		@UserRequest() user: User,
	) {
		return this.expedientsService.create(user, dto as any)
	}

	@Patch(':id')
	update(
		@Param('id', new ParseUUIDPipe()) id: string,
		@Body() dto: UpdateExpedientConsultancyDto,
		@UserRequest() user: User,
	) {
		return this.expedientsService.update(user, dto as any, id)
	}
}
