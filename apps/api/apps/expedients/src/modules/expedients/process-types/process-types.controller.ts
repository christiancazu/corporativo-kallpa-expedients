import { Controller, Get } from '@nestjs/common'
import { ProcessTypesService } from './process-types.service'

@Controller('process-types')
export class ProcessTypesController {
	constructor(private readonly _service: ProcessTypesService) {}

	@Get()
	findAll() {
		return this._service.findAll()
	}
}
