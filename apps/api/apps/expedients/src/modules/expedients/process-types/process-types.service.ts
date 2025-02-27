import { EXPEDIENT_TYPE } from '@expedients/shared'
import {
	BadRequestException,
	Inject,
	Injectable,
	UnprocessableEntityException,
} from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { InjectRepository } from '@nestjs/typeorm'
import { And, Brackets, type Repository } from 'typeorm'
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
