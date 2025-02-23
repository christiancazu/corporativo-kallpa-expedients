import { IExpedient } from '@expedients/shared'
import { useQuery } from '@tanstack/react-query'
import { httpClient } from '../config/httpClient'
import { useExpedientsState } from '../hooks/useExpedientsState'

export const useExpedientsService = () => {
	const { currentExpedientType } = useExpedientsState()

	const getExpedients = useQuery({
		queryKey: [currentExpedientType],
		queryFn: async (): Promise<IExpedient[]> => {
			return httpClient
				.get(`${currentExpedientType}${window.location.search}`)
				.then((res) => res.data)
		},
		enabled: false,
		select: (expedients) =>
			expedients.map((expedient) => ({ ...expedient, key: expedient.id })),
	})

	const getExpedient = (id: string): Promise<IExpedient> => {
		return httpClient
			.get(`${currentExpedientType}/${id}`)
			.then((res) => res.data)
	}

	const createExpedient = (expedient: IExpedient) => {
		return httpClient
			.post(currentExpedientType, expedient)
			.then((res) => res.data)
	}

	const updateExpedient = ({
		id,
		expedient,
	}: { id: string; expedient: IExpedient }): Promise<any> => {
		return httpClient
			.patch(`${currentExpedientType}/${id}`, expedient)
			.then((res) => res.data)
	}

	const getExpedientsEvents = (): Promise<IExpedient[]> => {
		return httpClient
			.get(`${currentExpedientType}/events`)
			.then((res) => res.data)
	}

	const getEmpresaExpedientEvents = (
		expedientId: string,
	): Promise<IExpedient> => {
		return httpClient
			.get(`${currentExpedientType}/${expedientId}/events`)
			.then((res) => res.data)
	}

	return {
		getExpedients,
		createExpedient,
	}
}
