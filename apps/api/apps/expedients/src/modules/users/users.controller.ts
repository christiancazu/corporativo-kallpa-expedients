import { SETTINGS, USER_ROLES } from '@expedients/shared'
import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Param,
	Patch,
	Post,
	Put,
} from '@nestjs/common'
import type { ClientProxy } from '@nestjs/microservices'
import type { MailActivateAccountPayload } from 'apps/messenger/src/types'
import { firstValueFrom } from 'rxjs'
import { AuthService } from '../auth/auth.service'
import { FileUploadInterceptor } from '../storage/decorators/file-interceptor.decorator'
import { UploadedFileParam } from '../storage/decorators/uploaded-file-param.decorator'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './entities/user.entity'
import { UserRequest } from './user-request.decorator'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
	constructor(
		private readonly _usersService: UsersService,

		private readonly _authService: AuthService,

		@Inject(SETTINGS.MESSENGER_SERVICE)
		private readonly _clientProxy: ClientProxy,
	) {}

	@Get()
	findAll() {
		return this._usersService.findAll()
	}

	@Get('me')
	findMe(@UserRequest() user: User) {
		return this._usersService.findMe(user)
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(
		@Body() createUserDto: CreateUserDto,
		@UserRequest() user: User,
	) {
		if (user.role !== USER_ROLES.ADMIN)
			throw new BadRequestException('user not authorized')

		const userCreated = await this._usersService.create(createUserDto)
		const token = await this._authService.signToken(userCreated)

		try {
			await firstValueFrom(
				this._clientProxy.send<any, MailActivateAccountPayload>(
					SETTINGS.EVENT_MAIL_ACTIVATE_ACCOUNT,
					{ user: userCreated, token },
				),
			)

			return 'user created successfully'
		} catch {
			throw new BadRequestException('error sending email')
		}
	}

	@Post('resend-activation')
	@HttpCode(HttpStatus.CREATED)
	async resendActivation(@Body() payload: any, @UserRequest() user: User) {
		if (user.role !== USER_ROLES.ADMIN)
			throw new BadRequestException('user not authorized')

		const userFound = await this._usersService.findByEmail(payload.email)
		const token = await this._authService.signToken(userFound)

		try {
			await firstValueFrom(
				this._clientProxy.send<any, MailActivateAccountPayload>(
					SETTINGS.EVENT_MAIL_ACTIVATE_ACCOUNT,
					{ user: userFound, token },
				),
			)

			return 'invitation send successfully'
		} catch {
			throw new BadRequestException('error sending email')
		}
	}

	@Put('avatar')
	@FileUploadInterceptor('avatars')
	uploadAvatar(
		@UploadedFileParam() file: Express.Multer.File,
		@UserRequest() user: User,
	) {
		return this._usersService.uploadAvatar(user, file)
	}

	@Patch(':id')
	update(@Param('id') id: string) {
		return this._usersService.update(id)
	}
}
