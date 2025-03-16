import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Cache } from 'cache-manager'
import { type Repository } from 'typeorm'
import { MatterType } from './entities/matter-types.entity'

// TODO: CACHE
@Injectable()
export class MatterTypesService implements OnModuleInit {
	constructor(
		@InjectRepository(MatterType)
		private readonly _repository: Repository<MatterType>,

		@Inject(CACHE_MANAGER)
		private readonly _cacheManager: Cache,
	) {}

	async onModuleInit() {
		await this._cacheManager.set(
			'matter-types:find-all',
			await this.findAll(),
			0,
		)
	}

	findAll() {
		return this._repository.find()
	}

	cacheFindAll() {
		return this._cacheManager.get<MatterType[]>(
			'matter-types:find-all',
		) as Promise<MatterType[]>
	}
}
