import { AsyncLocalStorage } from 'node:async_hooks'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class AlsService {
	constructor(
		@Inject(AsyncLocalStorage)
		private readonly als: AsyncLocalStorage<Map<string, any>>,
	) {}

	run(callback: () => void, initialData: Map<string, any> = new Map()) {
		return this.als.run(initialData, callback)
	}

	get<T>(key: string): T | undefined {
		const store = this.als.getStore()
		return store ? store.get(key) : undefined
	}

	set(key: string, value: any) {
		const store = this.als.getStore()
		if (store) {
			store.set(key, value)
		}
	}
}
