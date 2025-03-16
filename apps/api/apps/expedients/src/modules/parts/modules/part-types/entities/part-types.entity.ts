import { EXPEDIENT_TYPE, FIELD, IPartType } from '@expedients/shared'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Part } from '../../../entities/part.entity'

@Entity('parts_types')
export class PartType implements IPartType {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column({
		type: 'varchar',
		length: FIELD.PROCESS_TYPE_MAX_LENGTH,
	})
	description: string

	@Column({
		type: 'enum',
		name: 'expedientType',
		enumName: 'expedient_type',
		enum: EXPEDIENT_TYPE,
		array: true,
		nullable: true,
	})
	expedientType: EXPEDIENT_TYPE[]

	@OneToMany(
		() => Part,
		(part) => part.type,
		{ cascade: true },
	)
	parts: Part[]

	constructor(id?: string) {
		if (id) {
			this.id = id
		}
	}
}
