import { Controller, Get } from '@nestjs/common'
import { PartTypesService } from './part-types.service'

@Controller('parts-types')
export class PartTypesController {
	constructor(private readonly _service: PartTypesService) {}

	@Get()
	findAll() {
		return this._service.cacheFindAll()
	}
}
