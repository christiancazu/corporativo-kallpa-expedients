import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { type Repository } from 'typeorm'
import { ExpedientStatus } from './entities/expedient-status.entity'

@Injectable()
export class ExpedientStatusService {
	constructor(
		@InjectRepository(ExpedientStatus)
		private readonly _repository: Repository<ExpedientStatus>,
	) {}

	findAll() {
		return this._repository.find()
	}
}
