import { isPlatformIOS } from './utils'

export default function setupNotificationPermission() {
	if (Notification.permission === 'granted') {
		console.log('notification granted')
	} else if (Notification.permission !== 'denied') {
		console.log('request denied')
		Notification.requestPermission().then((permission) => {
			if (isPlatformIOS()) {
				postMessage(permission)
			}
		})
	}
}
