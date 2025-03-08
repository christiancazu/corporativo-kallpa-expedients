import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MatterType } from './entities/matter-types.entity'
import { MatterTypesController } from './matter-types.controller'
import { MatterTypesService } from './matter-types.service'

@Module({
	imports: [TypeOrmModule.forFeature([MatterType])],
	controllers: [MatterTypesController],
	providers: [MatterTypesService],
	exports: [TypeOrmModule, MatterTypesService],
})
export class MatterTypesModule {}
