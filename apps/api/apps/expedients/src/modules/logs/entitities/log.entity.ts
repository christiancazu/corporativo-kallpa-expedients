import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { LOG_ACTION } from '../enums'

@Entity('logs')
export class Log {
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Column({ type: 'jsonb', nullable: true })
	log: any

	@Column({
		type: 'enum',
		name: 'type',
		enumName: 'log_type',
		enum: LOG_ACTION,
		nullable: true,
	})
	action: LOG_ACTION

	@Column({ type: 'varchar', length: 3, nullable: true })
	responseStatus: string

	@ManyToOne(
		() => User,
		({ logs }) => logs,
	)
	user: User

	@CreateDateColumn()
	createdAt: Date
}
