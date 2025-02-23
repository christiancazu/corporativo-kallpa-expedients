import { Module } from '@nestjs/common'
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Part } from '../parts/entities/part.entity'
import { Expedient } from './entities/expedient.entity'
import { ExpedientsAsesoriaController } from './expedients-asesoria.controller'
import { ExpedientsEmpresaController } from './expedients-empresa.controller'
import { ExpedientsService } from './expedients.service'

@Module({
	imports: [TypeOrmModule.forFeature([Expedient, Part])],
	controllers: [ExpedientsEmpresaController, ExpedientsAsesoriaController],
	providers: [ExpedientsService, ExecutionContextHost],
	exports: [ExpedientsService],
})
export class ExpedientsModule {}
