import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PartType } from './entities/part-types.entity'
import { PartTypesController } from './part-types.controller'
import { PartTypesService } from './part-types.service'

@Module({
	imports: [TypeOrmModule.forFeature([PartType])],
	controllers: [PartTypesController],
	providers: [PartTypesService],
	exports: [TypeOrmModule, PartTypesService],
})
export class PartTypesModule {}
