import { FIELD, IPart } from '@expedients/shared'
import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { Expedient } from '../../expedients/entities/expedient.entity'
import { PartType } from '../modules/part-types/entities/part-types.entity'

@Entity('parts')
export class Part implements IPart {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column({ type: 'varchar', length: FIELD.PART_NAME_MAX_LENGTH })
	name: string

	@ManyToOne(
		() => PartType,
		(partType) => partType.parts,
		{
			nullable: true,
		},
	)
	type: PartType

	@Column({
		type: 'varchar',
		length: FIELD.PART_TYPE_DESCRIPTION_MAX_LENGTH,
		nullable: true,
	})
	typeDescription: string | null

	@ManyToOne(
		() => Expedient,
		(expedient) => expedient.parts,
	)
	expedient: Expedient

	@CreateDateColumn()
	createdAt: Date
}
