import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProcessType } from './entities/process-types.entity'
import { ProcessTypesController } from './process-types.controller'
import { ProcessTypesService } from './process-types.service'

@Module({
	imports: [TypeOrmModule.forFeature([ProcessType])],
	controllers: [ProcessTypesController],
	providers: [ProcessTypesService],
	exports: [TypeOrmModule, ProcessTypesService],
})
export class ProcessTypesModule {}
