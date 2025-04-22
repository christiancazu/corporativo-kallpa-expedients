import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Log } from './entitities/log.entity'
import { LogsService } from './logs.service'

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([Log])],
	providers: [LogsService],
	exports: [TypeOrmModule, LogsService],
})
export class LogsModule {}
