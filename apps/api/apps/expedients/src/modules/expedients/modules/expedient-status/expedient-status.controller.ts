import { Controller, Get } from '@nestjs/common'
import { ExpedientStatusService } from './expedient-status.service'

@Controller('expedient-status')
export class ExpedientStatusController {
	constructor(private readonly _service: ExpedientStatusService) {}

	@Get()
	findAll() {
		return this._service.findAll()
	}
}
