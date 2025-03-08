import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Part } from '../parts/entities/part.entity'
import { Expedient } from './entities/expedient.entity'
import { ExpedientsConsultancyController } from './expedients-consultancy.controller'
import { ExpedientsInvestigationProcessesController } from './expedients-investigation-processes.controller'
import { ExpedientsJudicialProcessesController } from './expedients-judicial-processes.controller'
import { ExpedientsController } from './expedients.controller'
import { ExpedientsService } from './expedients.service'
import { ExpedientStatus } from './modules/expedient-status/entities/expedient-status.entity'
import { ExpedientStatusModule } from './modules/expedient-status/expedient-status.module'
import { ExpedientStatusService } from './modules/expedient-status/expedient-status.service'
import { MatterTypesModule } from './modules/matter-types/matter-types.module'
import { ProcessTypesModule } from './modules/process-types/process-types.module'
import { ExpedientStatusValidator } from './validators/expedient-status.validator'
import { ExpedientTypeValidator } from './validators/expedient-type.validator'
import { MatterTypeValidator } from './validators/matter-type.validator'

@Module({
	imports: [
		TypeOrmModule.forFeature([Expedient, Part]),
		ProcessTypesModule,
		MatterTypesModule,
		ExpedientStatusModule,
	],
	controllers: [
		ExpedientsController,
		ExpedientsJudicialProcessesController,
		ExpedientsInvestigationProcessesController,
		ExpedientsConsultancyController,
	],
	providers: [
		ExpedientsService,
		ExecutionContextHost,
		ExpedientStatusService,
		ExpedientTypeValidator,
		ExpedientStatusValidator,
		MatterTypeValidator,
		{
			provide: APP_INTERCEPTOR,
			useClass: ExpedientTypeValidator,
		},
	],
	exports: [TypeOrmModule, ExpedientsService, ExpedientStatusService],
})
export class ExpedientsModule {}
