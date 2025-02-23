import { EXPEDIENT_TYPE } from '@expedients/shared'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useLocation, useMatches } from 'react-router'
import { queryClient } from '../config/queryClient'

const EXPEDIENT_ROUTES = ['/asesoria', '/empresa']

export const useExpedientsState = () => {
	const location = useLocation()
	const matches = useMatches()

	useEffect(() => {
		const match = matches.find((match) =>
			EXPEDIENT_ROUTES.includes(match.pathname),
		)

		setCurrentExpedientType(match!.pathname.substring(1) as EXPEDIENT_TYPE)
	}, [location.pathname])

	const setCurrentExpedientType = (type: EXPEDIENT_TYPE) => {
		return queryClient.setQueryData(['expedientType'], type)
	}

	return {
		currentExpedientType: useQuery<EXPEDIENT_TYPE>({
			queryKey: ['expedientType'],
			enabled: false,
			initialData: location.pathname.substring(1) as EXPEDIENT_TYPE,
		}).data,
	}
}
