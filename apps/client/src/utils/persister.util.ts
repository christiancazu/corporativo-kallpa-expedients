import type { IUser } from '@expedients/shared'

export default {
	set: (key: string, value: any) => localStorage.setItem(key, value),

	remove: (key: string) => localStorage.removeItem(key),

	get: (key: string) => localStorage.getItem(key) ?? null,

	setUser: (user: IUser) => localStorage.setItem('user', JSON.stringify(user)),

	purgeUser: () => localStorage.removeItem('user'),

	getUser: (): IUser | undefined => {
		const user = JSON.parse(localStorage.getItem('user') || '{}')

		if (!user?.id) {
			return undefined
		}

		return user as IUser
	},

	setVapidKey: (key: string) => localStorage.setItem('vapidKey', key),

	getVapidKey: () => localStorage.getItem('vapidKey') ?? null,

	purgeSession: () => {
		localStorage.removeItem('user')
		localStorage.removeItem('token')
		localStorage.removeItem('subscribed')
	},
}
