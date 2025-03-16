import { FIELD, IMatterType } from '@expedients/shared'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Expedient } from '../../../entities/expedient.entity'

@Entity('matter_types')
export class MatterType implements IMatterType {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column({
		type: 'varchar',
		length: FIELD.MATTER_TYPE_MAX_LENGTH,
	})
	description: string

	@Column({
		type: 'varchar',
		length: FIELD.MATTER_TYPE_COLOR_MAX_LENGTH,
	})
	color: string

	@OneToMany(
		() => Expedient,
		(expedient) => expedient.matterType,
		{ cascade: true },
	)
	expedients: Expedient[]

	constructor(id?: string) {
		if (id) {
			this.id = id
		}
	}
}
