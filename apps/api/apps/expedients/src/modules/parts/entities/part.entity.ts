import { FIELD, IPart, PART_TYPES } from '@expedients/shared'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Expedient } from '../../expedients/entities/expedient.entity'

@Entity('parts')
export class Part implements IPart {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column({ type: 'varchar', length: FIELD.PART_NAME_MAX_LENGTH })
	name: string

	@Column({
		type: 'enum',
		name: 'type',
		enumName: 'part_type',
		enum: PART_TYPES,
		nullable: true,
	})
	type: PART_TYPES

	@ManyToOne(
		() => Expedient,
		(expedient) => expedient.parts,
	)
	expedient: Expedient
}
