import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, type Repository } from 'typeorm'
import type { User } from '../users/entities/user.entity'
import type { SubscriptionNotificationDto } from './dto/subscription-notification.dto'
import { Notification } from './entities/notification.entity'

@Injectable()
export class NotificationsService {
	constructor(
		@InjectRepository(Notification)
		private readonly _notificationsRepository: Repository<Notification>,
	) {}

	findSubscriptionByUser({
		assignedLawyer,
		assignedAssistant,
	}: { assignedLawyer: User; assignedAssistant: User }) {
		return this._notificationsRepository.find({
			where: [
				{
					registerFor: assignedLawyer,
				},
				{
					registerFor: assignedAssistant,
				},
			],
		})
	}

	subscribe(user: User, dto: SubscriptionNotificationDto) {
		return this._notificationsRepository.save({
			endpoint: dto.endpoint,
			auth: dto.keys.auth,
			p256dh: dto.keys.p256dh,
			registerFor: user,
		})
	}

	unsubscribe(user: User) {
		return this._notificationsRepository.delete({ registerFor: user })
	}

	removeSubscriptionEndpoints(endpoints: string[]) {
		if (!endpoints.length) {
			return Promise.resolve()
		}

		return this._notificationsRepository.delete({ endpoint: In(endpoints) })
	}
}
