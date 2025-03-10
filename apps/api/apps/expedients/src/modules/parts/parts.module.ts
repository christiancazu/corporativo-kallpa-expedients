import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Part } from './entities/part.entity'
import { PartTypesModule } from './modules/part-types/part-types.module'
import { PartsService } from './parts.service'

@Module({
	imports: [TypeOrmModule.forFeature([Part]), PartTypesModule],
	controllers: [],
	providers: [PartsService],
})
export class PartsModule {}
