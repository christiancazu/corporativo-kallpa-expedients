import { Body, Controller, Post } from '@nestjs/common'
import { NotLoggeable } from '../logs/decoratos/is-not-Loggeable.decorator'
import { User } from '../users/entities/user.entity'
import { UserRequest } from '../users/user-request.decorator'
import { SubscriptionNotificationDto } from './dto/subscription-notification.dto'
import { NotificationsService } from './notifications.service'

@NotLoggeable()
@Controller('notifications')
export class NotificationsController {
	constructor(private readonly notificationsService: NotificationsService) {}

	@Post('subscribe')
	subscribe(
		@Body() dto: SubscriptionNotificationDto,
		@UserRequest() user: User,
	) {
		return this.notificationsService.subscribe(user, dto)
	}

	@Post('unsubscribe')
	unsubscribe(@UserRequest() user: User) {
		return this.notificationsService.unsubscribe(user)
	}
}
