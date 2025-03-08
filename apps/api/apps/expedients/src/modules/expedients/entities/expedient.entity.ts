import { EXPEDIENT_TYPE, FIELD, IExpedient } from '@expedients/shared'
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'
import { Document } from '../../documents/entities/document.entity'
import { Event } from '../../events/entities/event.entity'
import { Part } from '../../parts/entities/part.entity'
import { Review } from '../../reviews/entities/review.entity'
import { User } from '../../users/entities/user.entity'
import { ExpedientStatus } from '../modules/expedient-status/entities/expedient-status.entity'
import { MatterType } from '../modules/matter-types/entities/matter-types.entity'
import { ProcessType } from '../modules/process-types/entities/process-types.entity'

@Entity('expedients')
export class Expedient implements IExpedient {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column({
		type: 'varchar',
		length: FIELD.EXPEDIENT_CODE_MAX_LENGTH,
	})
	code: string

	@Column({
		type: 'enum',
		name: 'type',
		enumName: 'expedient_type',
		enum: EXPEDIENT_TYPE,
		default: EXPEDIENT_TYPE.EMPRESA,
	})
	type: EXPEDIENT_TYPE

	@Column({
		type: 'varchar',
		length: FIELD.EXPEDIENT_SUBJECT_MAX_LENGTH,
	})
	subject: string

	@Column({
		type: 'varchar',
		length: FIELD.EXPEDIENT_ENTITY_MAX_LENGTH,
		nullable: true,
	})
	entity: string

	@ManyToOne(
		() => ProcessType,
		(processType) => processType.expedients,
	)
	processType: ProcessType

	@ManyToOne(
		() => MatterType,
		(matterType) => matterType.expedients,
	)
	matterType: MatterType

	@Column({
		type: 'varchar',
		length: FIELD.EXPEDIENT_COURT_MAX_LENGTH,
	})
	court: string

	@ManyToOne(
		() => ExpedientStatus,
		(matterType) => matterType.expedients,
	)
	status: ExpedientStatus

	@Column({
		type: 'varchar',
		length: FIELD.EXPEDIENT_STATUS_DESCRIPTION_MAX_LENGTH,
		nullable: true,
	})
	statusDescription: string

	@ManyToOne(
		() => User,
		(user) => user.assignedLawyerExpedients,
	)
	assignedLawyer: User

	@ManyToOne(
		() => User,
		(user) => user.assignedAssistantExpedients,
	)
	assignedAssistant: User

	@ManyToOne(
		() => User,
		(user) => user.createdExpedients,
	)
	createdByUser: User

	@ManyToOne(
		() => User,
		(user) => user.updatedExpedients,
	)
	updatedByUser: User

	@OneToMany(
		() => Part,
		(part) => part.expedient,
		{ cascade: true },
	)
	parts: Part[]

	@OneToMany(
		() => Review,
		(review) => review.expedient,
	)
	reviews: Review[]

	@OneToMany(
		() => Document,
		(document) => document.expedient,
	)
	documents: Document[]

	@OneToMany(
		() => Event,
		(event) => event.expedient,
	)
	events: Event[]

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date

	constructor(id?: string) {
		if (id) {
			this.id = id
		}
	}
}
