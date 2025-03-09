import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Cache } from 'cache-manager'
import { type Repository } from 'typeorm'
import { ProcessType } from './entities/process-types.entity'

// TODO: CACHE
@Injectable()
export class ProcessTypesService implements OnModuleInit {
	constructor(
		@InjectRepository(ProcessType)
		private readonly _repository: Repository<ProcessType>,

		@Inject(CACHE_MANAGER)
		private readonly _cacheManager: Cache,
	) {}

	async onModuleInit() {
		await this._cacheManager.set(
			'process-type:find-all',
			await this.findAll(),
			0,
		)
	}

	findAll() {
		return this._repository.find()
	}

	cacheFindAll() {
		return this._cacheManager.get<ProcessType[]>('process-type:find-all')
	}
}
