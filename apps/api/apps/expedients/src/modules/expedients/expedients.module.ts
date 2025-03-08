import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Part } from '../parts/entities/part.entity'
import { Expedient } from './entities/expedient.entity'
import { ExpedientsAsesoriaController } from './expedients-asesoria.controller'
import { ExpedientsEmpresaController } from './expedients-empresa.controller'
import { ExpedientsController } from './expedients.controller'
import { ExpedientsService } from './expedients.service'
import { ExpedientStatusModule } from './modules/expedient-status/expedient-status.module'
import { MatterTypesModule } from './modules/matter-types/matter-types.module'
import { ProcessTypesModule } from './modules/process-types/process-types.module'
import { UsuarioGrupoNombre } from './validators/test.validator'

@Module({
	imports: [
		TypeOrmModule.forFeature([Expedient, Part]),
		ProcessTypesModule,
		MatterTypesModule,
		ExpedientStatusModule,
	],
	controllers: [
		ExpedientsController,
		ExpedientsEmpresaController,
		ExpedientsAsesoriaController,
	],
	providers: [
		ExpedientsService,
		ExecutionContextHost,
		UsuarioGrupoNombre,
		{
			provide: APP_INTERCEPTOR,
			useClass: UsuarioGrupoNombre,
		},
	],
	exports: [ExpedientsService],
})
export class ExpedientsModule {}
