import { ICreateExpedientDto, IExpedient } from '@expedients/shared'
import { useQuery } from '@tanstack/react-query'
import { httpClient } from '../config/httpClient'
import { useExpedientsState } from '../hooks/useExpedientsState'

export const useExpedientsService = () => {
	const { currentExpedientTypeEndpoint } = useExpedientsState()

	const getExpedients = useQuery({
		queryKey: [currentExpedientTypeEndpoint],
		queryFn: async (): Promise<IExpedient[]> => {
			return httpClient
				.get(`${currentExpedientTypeEndpoint}${window.location.search}`)
				.then((res) => res.data)
		},
		enabled: false,
		select: (expedients) =>
			expedients.map((expedient) => ({ ...expedient, key: expedient.id })),
	})

	const getExpedient = (id: string): Promise<IExpedient> => {
		return httpClient
			.get(`${currentExpedientTypeEndpoint}/${id}`)
			.then((res) => res.data)
	}

	const createExpedient = (expedient: ICreateExpedientDto) => {
		return httpClient
			.post(currentExpedientTypeEndpoint, expedient)
			.then((res) => res.data)
	}

	const updateExpedient = ({
		id,
		expedient,
	}: { id: string; expedient: ICreateExpedientDto }): Promise<any> => {
		return httpClient
			.patch(`${currentExpedientTypeEndpoint}/${id}`, expedient)
			.then((res) => res.data)
	}

	const getExpedientsEvents = (): Promise<IExpedient[]> => {
		return httpClient.get('expedients/events').then((res) => res.data)
	}

	const getExpedientEvents = (expedientId: string): Promise<IExpedient> => {
		return httpClient
			.get(`${currentExpedientTypeEndpoint}/${expedientId}/events`)
			.then((res) => res.data)
	}

	return {
		getExpedient,
		getExpedients,
		createExpedient,
		updateExpedient,
		getExpedientsEvents,
		getExpedientEvents,
	}
}
