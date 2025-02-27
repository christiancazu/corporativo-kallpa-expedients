import {
	EXPEDIENT_STATUS,
	EXPEDIENT_TYPE,
	FIELD,
	IExpedient,
} from '@expedients/shared'
import {
	BeforeInsert,
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
import { ProcessType } from '../process-types/entities/process-types.entity'

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

	@Column({
		type: 'varchar',
		length: FIELD.EXPEDIENT_COURT_MAX_LENGTH,
	})
	court: string

	@Column({
		type: 'enum',
		name: 'status',
		enumName: 'status',
		enum: EXPEDIENT_STATUS,
		default: EXPEDIENT_STATUS.EN_EJECUCION,
	})
	status: EXPEDIENT_STATUS

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

	@BeforeInsert()
	defaultStatus() {
		if (!this.status) {
			this.status = EXPEDIENT_STATUS.EN_EJECUCION
		}
	}

	constructor(id?: string) {
		if (id) {
			this.id = id
		}
	}
}
