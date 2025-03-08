import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { type Repository } from 'typeorm'
import { MatterType } from './entities/matter-types.entity'

@Injectable()
export class MatterTypesService {
	constructor(
		@InjectRepository(MatterType)
		private readonly _repository: Repository<MatterType>,
	) {}

	findAll() {
		return this._repository.find()
	}
}
