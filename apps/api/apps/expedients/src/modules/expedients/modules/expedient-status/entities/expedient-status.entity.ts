import { FIELD, IExpedientStatus } from '@expedients/shared'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Expedient } from '../../../entities/expedient.entity'

@Entity('expedients_status')
export class ExpedientStatus implements IExpedientStatus {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column({
		type: 'varchar',
		length: FIELD.EXPEDIENT_STATUS_MAX_LENGTH,
	})
	description: string

	@OneToMany(
		() => Expedient,
		(expedient) => expedient.status,
		{ cascade: true },
	)
	expedients: Expedient[]

	constructor(id?: string) {
		if (id) {
			this.id = id
		}
	}
}
