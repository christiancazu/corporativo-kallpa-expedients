import { EXPEDIENT_TYPE } from '@expedients/shared'
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
	expedientType: EXPEDIENT_TYPE
}

export interface ErrorPushNotification {
	status: number
	reason?: WebPushError
}
