import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Cache } from 'cache-manager'
import { type Repository } from 'typeorm'
import { PartType } from './entities/part-types.entity'

@Injectable()
export class PartTypesService implements OnModuleInit {
	constructor(
		@InjectRepository(PartType)
		private readonly _repository: Repository<PartType>,

		@Inject(CACHE_MANAGER)
		private readonly _cacheManager: Cache,
	) {}

	async onModuleInit() {
		await this._cacheManager.set('part-type:find-all', await this.findAll(), 0)
	}

	findAll() {
		return this._repository.find()
	}

	cacheFindAll() {
		return this._cacheManager.get<PartType[]>('part-type:find-all')
	}
}
