import { SetMetadata } from '@nestjs/common'

export const NotLoggeable = () => SetMetadata('isNotLoggeable', true)
