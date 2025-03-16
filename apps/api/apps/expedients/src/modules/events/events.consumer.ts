import {
	EXPEDIENT_TYPE_NAME_AS_FRONTEND_ENDPOINT,
	SETTINGS,
	TYPE_EXPEDIENT_TYPE_NAME_AS_FRONTEND_ENDPOINT,
} from '@expedients/shared'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { BadRequestException, Inject, Logger } from '@nestjs/common'
import type { ClientProxy } from '@nestjs/microservices'
import type { ScheduledEventPayload } from 'apps/messenger/src/types'
import type { Job } from 'bullmq'
import { firstValueFrom } from 'rxjs'
import { ExpedientsService } from '../expedients/expedients.service'
import { NotificationsService } from '../notifications/notifications.service'
import type { PushNotification } from '../notifications/types'
import { EventsService } from './events.service'
import { EVENT_QUEUE, type JobEventData } from './types'

@Processor(EVENT_QUEUE)
export class EventsConsumer extends WorkerHost {
	@Inject(ExpedientsService)
	private readonly _expedientsService: ExpedientsService

	@Inject(EventsService)
	private readonly _eventsService: EventsService

	@Inject(NotificationsService)
	private readonly _notificationsService: NotificationsService

	@Inject(SETTINGS.MESSENGER_SERVICE)
	private readonly _clientProxy: ClientProxy

	private _logger = new Logger()

	async process({
		data: { expedientId, eventId },
	}: Job<
		Pick<JobEventData, 'expedientId' | 'eventId'>,
		any,
		string
	>): Promise<any> {
		const expedient =
			await this._expedientsService.findOneWithUsers(expedientId)
		const event = await this._eventsService.findOne(eventId)

		if (!expedient) {
			throw new BadRequestException('expedient not found')
		}

		try {
			await firstValueFrom(
				this._clientProxy.send<any, ScheduledEventPayload>(
					SETTINGS.EVENT_SCHEDULED,
					{
						assignedLawyer: expedient.assignedLawyer,
						assignedAssistant: expedient.assignedAssistant,
						expedientId: expedient.id,
						eventMessage: event!.message,
						expedientTypeRoute: EXPEDIENT_TYPE_NAME_AS_FRONTEND_ENDPOINT[
							expedient.type
						] as TYPE_EXPEDIENT_TYPE_NAME_AS_FRONTEND_ENDPOINT,
					},
				),
			)

			this._eventsService.update(eventId, {
				isSent: true,
			})
		} catch (error) {
			this._logger.error('error sending email: ', error)
		}

		const notifications =
			await this._notificationsService.findSubscriptionByUser({
				assignedAssistant: expedient.assignedAssistant,
				assignedLawyer: expedient.assignedLawyer,
			})

		const toDeleteEndpoints = await firstValueFrom(
			this._clientProxy.send<any, PushNotification[]>(
				SETTINGS.NOTIFICATION_SCHEDULED,
				notifications.map((notification) => ({
					pushSubscription: {
						endpoint: notification.endpoint,
						keys: {
							p256dh: notification.p256dh,
							auth: notification.auth,
						},
					},
					title: 'Recordatorio de evento',
					body: event!.message,
					redirectUrl: `/${
						EXPEDIENT_TYPE_NAME_AS_FRONTEND_ENDPOINT[expedient.type]
					}/${expedient.id}`,
				})),
			),
		)

		return this._notificationsService.removeSubscriptionEndpoints(
			toDeleteEndpoints,
		)
	}
}
