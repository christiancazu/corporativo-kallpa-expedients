import { Controller, Get } from '@nestjs/common'
import { User } from '../users/entities/user.entity'
import { UserRequest } from '../users/user-request.decorator'
import { ExpedientsService } from './expedients.service'

@Controller('expedients')
export class ExpedientsController {
	constructor(private readonly expedientsService: ExpedientsService) {}

	@Get('events')
	findEvents(@UserRequest() user: User) {
		return this.expedientsService.findEvents(user)
	}
}
