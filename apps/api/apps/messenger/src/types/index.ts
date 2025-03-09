import { TYPE_EXPEDIENT_TYPE_NAME_AS_FRONTEND_ENDPOINT } from '@expedients/shared'
import { User } from 'apps/expedients/src/modules/users/entities/user.entity'
import { WebPushError } from 'web-push'

export interface MailActivateAccountPayload {
	user: Partial<User>
	token: string
}

export interface ScheduledEventPayload {
	assignedLawyer: User
	assignedAssistant: User
	eventMessage: string
	expedientId: string
	expedientTypeRoute: TYPE_EXPEDIENT_TYPE_NAME_AS_FRONTEND_ENDPOINT
}

export interface ErrorPushNotification {
	status: number
	reason?: WebPushError
}
