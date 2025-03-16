import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Cache } from 'cache-manager'
import { type Repository } from 'typeorm'
import { ExpedientStatus } from './entities/expedient-status.entity'

@Injectable()
export class ExpedientStatusService implements OnModuleInit {
	constructor(
		@InjectRepository(ExpedientStatus)
		private readonly _repository: Repository<ExpedientStatus>,

		@Inject(CACHE_MANAGER)
		private readonly _cacheManager: Cache,
	) {}

	async onModuleInit() {
		await this._cacheManager.set('expedients:find-all', await this.findAll(), 0)
		await this._cacheManager.set(
			'expedients:find-one-status-otros',
			await this.getExpedientStatusOtros(),
			0,
		)
	}

	findAll() {
		return this._repository.find()
	}

	cacheFindAll() {
		return this._cacheManager.get<ExpedientStatus[]>(
			'expedients:find-all',
		) as Promise<ExpedientStatus[]>
	}

	getExpedientStatusOtros() {
		return this._repository.findOne({ where: { description: 'Otros' } })
	}

	cacheGetExpedientStatusOtros() {
		return this._cacheManager.get<ExpedientStatus>(
			'expedients:find-one-status-otros',
		)
	}
}
