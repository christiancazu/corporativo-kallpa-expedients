import { EXPEDIENT_TYPE } from '@expedients/shared'
import {
	BadRequestException,
	Inject,
	Injectable,
	UnprocessableEntityException,
} from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, type Repository } from 'typeorm'
import { Part } from '../parts/entities/part.entity'
import { Review } from '../reviews/entities/review.entity'
import { User } from '../users/entities/user.entity'
import type { CreateExpedientDto } from './dto/create-expedient.dto'
import type { FindExpedientDto } from './dto/find-expedient.dto'
import type { UpdateExpedientDto } from './dto/update-expedient.dto'
import { Expedient } from './entities/expedient.entity'
import { expedientByTextFilterableFields } from './expedients.consts'
import { REQUEST_EXPEDIENT_TYPE } from './guards/expedient-type.guard'
import { ProcessType } from './process-types/entities/process-types.entity'

// TODO: cuando se borra una review poner la ultima la mas reciente
@Injectable()
export class ExpedientsService {
	constructor(
		@InjectRepository(Expedient)
		private readonly _expedientRepository: Repository<Expedient>,

		@InjectRepository(Part)
		private readonly _partsRepository: Repository<Part>,

		@Inject(REQUEST)
		private readonly _request: any,
	) {}

	async create(user: User, dto: CreateExpedientDto, expedient?: Expedient) {
		const { parts, ...restExpedient } = dto

		const expedientCreated = this._expedientRepository.create({
			...restExpedient,
			id: expedient?.id,
		})

		if (!expedient) {
			expedientCreated.createdByUser = user
		}

		expedientCreated.updatedByUser = user

		if (dto.assignedLawyerId) {
			expedientCreated.assignedLawyer = new User(dto.assignedLawyerId)
		}

		if (dto.assignedAssistantId) {
			expedientCreated.assignedAssistant = new User(dto.assignedAssistantId)
		}

		if (dto.processTypeId) {
			expedientCreated.processType = new ProcessType(dto.processTypeId)
		}

		let deletedParts: Part[] = []

		if (expedient) {
			deletedParts = expedient?.parts.reduce<Part[]>((acc, part) => {
				const existsPart = parts.find((p) => p.id === part.id)

				if (!existsPart) {
					acc.push(part)
				}
				return acc
			}, [])
		}

		if (this.getExpedientType() === EXPEDIENT_TYPE.EMPRESA) {
			expedientCreated.entity = null!
		} else {
			expedientCreated.processType = null!
		}

		try {
			expedientCreated.type = this.getExpedientType()

			const expedientSaved =
				await this._expedientRepository.save(expedientCreated)

			if (parts?.length) {
				const result = this._partsRepository.create(
					parts.map((part) => ({ ...part, expedient: expedientSaved })),
				)

				await this._partsRepository.save(result)
			}

			if (deletedParts.length) {
				await this._partsRepository.remove(deletedParts)
			}
			return expedientSaved
		} catch (error) {
			throw new UnprocessableEntityException(
				error?.driverError?.detail ?? error,
			)
		}
	}

	async findAll(query: FindExpedientDto): Promise<Expedient[]> {
		const { text, updatedByUser, status } = query

		const qb = this._expedientRepository
			.createQueryBuilder('expedients')
			.select('expedients')
			.leftJoin('expedients.processType', 'processType')
			.addSelect(['processType.id', 'processType.description'])
			.leftJoin('expedients.updatedByUser', 'updatedByUser')
			.addSelect([
				'updatedByUser.firstName',
				'updatedByUser.surname',
				'updatedByUser.avatar',
			])
			.leftJoin('expedients.assignedLawyer', 'assignedLawyer')
			.addSelect([
				'assignedLawyer.firstName',
				'assignedLawyer.surname',
				'assignedLawyer.avatar',
			])
			.leftJoin('expedients.assignedAssistant', 'assignedAssistant')
			.addSelect([
				'assignedAssistant.firstName',
				'assignedAssistant.surname',
				'assignedLawyer.avatar',
			])
			.leftJoinAndSelect('expedients.parts', 'parts')
			.where('expedients.type = :type', { type: this.getExpedientType() })

		/** If exists filter: text will filter by each filterable field */
		if (text) {
			qb.andWhere(
				new Brackets((_qb) => {
					_qb.where('expedients.code::text ILIKE :qcode', {
						qcode: `%${text}%`,
					})
					for (const field of expedientByTextFilterableFields) {
						_qb.orWhere(`expedients.${field}::text ILIKE :q${field}`, {
							[`q${field}`]: `%${text}%`,
						})
					}
				}),
			)
		}

		/** If exists filter: updatedByUser will filter by his id */
		if (updatedByUser) {
			qb.andWhere('expedients.updatedByUser = :updatedByUser', {
				updatedByUser,
			})
		}

		/** If exists filter: status will filter by it */
		if (status) {
			qb.andWhere('expedients.status = :status', {
				status,
			})
		}

		/** LEFT JOIN expedients with reviews and will select the last review by CreatedAt or empty reviews */
		qb.leftJoinAndMapOne(
			'expedients.reviews',
			Review,
			'reviews',
			'reviews."expedientId" = expedients.id',
		).andWhere(`
      (
        "reviews"."id" =
          (SELECT id
          FROM "reviews" "reviews"
          WHERE "expedients"."id" = "reviews"."expedientId"
          ORDER BY "createdAt"
          DESC
          LIMIT 1)
        OR REVIEWS."expedientId" IS NULL
      )
    `)

		qb.orderBy('expedients.updatedAt', 'DESC')

		return await qb.getMany()
	}

	findOneWithUsers(id: string) {
		return this._expedientRepository.findOne({
			where: { id },
			relations: {
				assignedLawyer: true,
				assignedAssistant: true,
			},
			select: {
				id: true,
				type: true,
				assignedLawyer: {
					id: true,
					email: true,
					firstName: true,
					surname: true,
				},
				assignedAssistant: {
					id: true,
					email: true,
					firstName: true,
					surname: true,
				},
			},
		})
	}

	async findOne(id: string) {
		const expedient = await this._expedientRepository.findOne({
			where: { id, type: this.getExpedientType() },
			relations: {
				parts: true,
				assignedLawyer: true,
				assignedAssistant: true,
				createdByUser: true,
				updatedByUser: true,
				documents: true,
				processType: true,
				reviews: {
					createdByUser: true,
				},
			},
			select: {
				parts: {
					id: true,
					name: true,
					type: true,
				},
				assignedLawyer: {
					id: true,
					firstName: true,
					surname: true,
					avatar: true,
				},
				assignedAssistant: {
					id: true,
					firstName: true,
					surname: true,
					avatar: true,
				},
				createdByUser: {
					id: true,
					firstName: true,
					surname: true,
					avatar: true,
				},
				updatedByUser: {
					firstName: true,
					surname: true,
					avatar: true,
				},
				reviews: {
					id: true,
					description: true,
					createdAt: true,
					createdByUser: {
						id: true,
						firstName: true,
						surname: true,
						avatar: true,
					},
				},
				documents: {
					id: true,
					name: true,
					key: true,
					extension: true,
					updatedAt: true,
					createdAt: true,
				},
			},
			order: {
				reviews: {
					createdAt: 'DESC',
				},
				documents: {
					createdAt: 'DESC',
				},
			},
		})

		if (!expedient) {
			throw new BadRequestException()
		}

		return expedient
	}

	findEvents(user: User) {
		return this._expedientRepository.find({
			where: [
				{
					assignedAssistant: user,
				},
				{
					assignedLawyer: user,
				},
			],
			relations: {
				events: true,
			},
			select: {
				id: true,
				code: true,
				events: {
					id: true,
					message: true,
					scheduledAt: true,
					isSent: true,
				},
			},
			order: {
				events: {
					scheduledAt: 'DESC',
				},
			},
		})
	}

	findByIdEvents(id: string) {
		return this._expedientRepository.findOne({
			where: { id },
			relations: {
				events: true,
			},
			select: {
				id: true,
				events: {
					id: true,
					message: true,
					scheduledAt: true,
					isSent: true,
				},
			},
			order: {
				events: {
					scheduledAt: 'DESC',
				},
			},
		})
	}

	getUserAssigned(assignedUser: User, id: string) {
		return this._expedientRepository.findOne({
			where: [
				{ id, assignedAssistant: assignedUser },
				{ id, assignedLawyer: assignedUser },
			],
		})
	}

	async update(user: User, dto: UpdateExpedientDto, id: string) {
		const expedient = await this._expedientRepository.findOne({
			where: { id },
			relations: {
				assignedAssistant: true,
				assignedLawyer: true,
				parts: true,
			},
			select: {
				assignedAssistant: {
					id: true,
				},
				assignedLawyer: {
					id: true,
				},
				parts: {
					id: true,
					name: true,
					type: true,
				},
			},
		})

		if (!expedient) {
			throw new UnprocessableEntityException('Expedient not found')
		}

		if (expedient.code === dto.code) {
			expedient.code = undefined!
			dto.code = undefined
		}

		if (expedient.assignedAssistant?.id === dto.assignedAssistantId) {
			dto.assignedAssistantId = undefined
		}

		if (expedient.assignedLawyer?.id === dto.assignedLawyerId) {
			dto.assignedLawyerId = undefined
		}

		return this.create(user, dto as CreateExpedientDto, expedient)
	}

	async updateDate(id: string, expedient: Partial<Expedient>) {
		return this._expedientRepository.update(id, expedient)
	}

	remove(id: number) {
		return `This action removes a #${id} expedient`
	}

	private getExpedientType(): EXPEDIENT_TYPE {
		return this._request.headers[REQUEST_EXPEDIENT_TYPE]
	}
}
