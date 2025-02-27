import { Module, Scope } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Part } from '../parts/entities/part.entity'
import { Expedient } from './entities/expedient.entity'
import { ExpedientsAsesoriaController } from './expedients-asesoria.controller'
import { ExpedientsEmpresaController } from './expedients-empresa.controller'
import { ExpedientsController } from './expedients.controller'
import { ExpedientsService } from './expedients.service'
import { ProcessTypesModule } from './process-types/process-types.module'

@Module({
	imports: [TypeOrmModule.forFeature([Expedient, Part]), ProcessTypesModule],
	controllers: [
		ExpedientsController,
		ExpedientsEmpresaController,
		ExpedientsAsesoriaController,
	],
	providers: [ExpedientsService, ExecutionContextHost],
	exports: [ExpedientsService],
})
export class ExpedientsModule {}
