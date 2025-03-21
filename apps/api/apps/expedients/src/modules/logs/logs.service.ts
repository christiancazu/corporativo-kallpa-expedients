import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { Repository } from 'typeorm'
import { AlsService } from '../global/als/als.service'
import { CreateLogDto, UpdateLogDto } from './dto/log.dto'
import { Log } from './entitities/log.entity'

@Injectable()
export class LogsService {
	constructor(
		@InjectRepository(Log)
		private readonly _partRepository: Repository<Log>,

		private readonly _alsService: AlsService,
	) {}

	async create(dto: CreateLogDto) {
		try {
			const { id } = await this._partRepository!.save({
				...dto,
				user: { id: dto.userId },
			})

			this._alsService.set('log:currentRequestLogId', id)
			return Promise.resolve()
		} catch (error) {
			Logger.error({
				type: 'log:create',
				...error,
			})
		}
	}

	async update(dto: UpdateLogDto) {
		const { id, ...restDto } = dto
		try {
			return await this._partRepository!.update(id, {
				...restDto,
			})
		} catch (error) {
			Logger.error({
				type: 'log:update',
				...error,
			})
		}
	}
}
