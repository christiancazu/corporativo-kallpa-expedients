import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ExpedientStatus } from './entities/expedient-status.entity'
import { ExpedientStatusController } from './expedient-status.controller'
import { ExpedientStatusService } from './expedient-status.service'

@Module({
	imports: [TypeOrmModule.forFeature([ExpedientStatus])],
	controllers: [ExpedientStatusController],
	providers: [ExpedientStatusService],
	exports: [TypeOrmModule, ExpedientStatusService],
})
export class ExpedientStatusModule {}
