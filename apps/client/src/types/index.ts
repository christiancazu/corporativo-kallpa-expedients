import type { IUser } from '@expedients/shared'

export interface CreateEvent {
	message: string
	expedientId: string
	scheduledAt: Date
}

export interface UserSession {
	user: IUser
	token: string
	vapidKey: string
}
