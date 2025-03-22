import { useQuery } from '@tanstack/react-query'

import type { IUser } from '@expedients/shared'
import { setToken } from '../config/httpClient'
import { queryClient } from '../config/queryClient'
import persisterUtil from '../utils/persister.util'

const useUserState = (user?: IUser) => {
	const setUser = (newUser: Partial<IUser> | null) => {
		queryClient.setQueryData(['user'], (prevState: IUser) => ({
			...prevState,
			...newUser,
		}))
		persisterUtil.setUser(newUser as IUser)
	}

	const isUserNotificationEnabled = useQuery({
		queryKey: ['notifications-enabled'],
		queryFn: () =>
			Promise.resolve(
				'Notification' in window && Notification.permission === 'granted',
			),
	}).data

	const setUserNotificationEnabled = (value: boolean) => {
		queryClient.setQueryData(['notifications-enabled'], value)
	}

	return {
		user: useQuery<IUser | null>({
			queryKey: ['user'],
			enabled: false,
			queryFn: () => Promise.resolve(user!),
		}).data,
		setUser,
		setUserSession(data: { user: IUser; token: string; vapidKey: string }) {
			persisterUtil.setUser(data.user)
			persisterUtil.setVapidKey(data.vapidKey)
			setUser(data.user)
			setToken(data.token)
		},
		purgeUserSession() {
			queryClient.setQueryData(['user'], null)
			persisterUtil.purgeSession()
		},
		isUserNotificationEnabled,
		setUserNotificationEnabled,
	}
}

export default useUserState
