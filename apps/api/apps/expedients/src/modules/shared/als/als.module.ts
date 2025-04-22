import { AsyncLocalStorage } from 'node:async_hooks'
import { Global, Module } from '@nestjs/common'
import { AlsService } from './als.service'

@Global()
@Module({
	providers: [
		{
			provide: AsyncLocalStorage,
			useValue: new AsyncLocalStorage<Map<string, any>>(),
		},
		AlsService,
	],
	exports: [AlsService],
})
export class AlsModule {}
