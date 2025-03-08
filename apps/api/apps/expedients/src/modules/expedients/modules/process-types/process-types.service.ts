import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { type Repository } from 'typeorm'
import { ProcessType } from './entities/process-types.entity'

@Injectable()
export class ProcessTypesService {
	constructor(
		@InjectRepository(ProcessType)
		private readonly _repository: Repository<ProcessType>,
	) {}

	findAll() {
		return this._repository.find()
	}
}
