import { Controller, Get } from '@nestjs/common'
import { MatterTypesService } from './matter-types.service'

@Controller('matter-types')
export class MatterTypesController {
	constructor(private readonly _service: MatterTypesService) {}

	@Get()
	findAll() {
		return this._service.findAll()
	}
}
