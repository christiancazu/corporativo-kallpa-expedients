import { FIELD, IProcessType } from '@expedients/shared'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Expedient } from '../../../entities/expedient.entity'

@Entity('process_types')
export class ProcessType implements IProcessType {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column({
		type: 'varchar',
		length: FIELD.PROCESS_TYPE_MAX_LENGTH,
	})
	description: string

	@OneToMany(
		() => Expedient,
		(expedient) => expedient.processType,
		{ cascade: true },
	)
	expedients: Expedient[]

	constructor(id?: string) {
		if (id) {
			this.id = id
		}
	}
}
