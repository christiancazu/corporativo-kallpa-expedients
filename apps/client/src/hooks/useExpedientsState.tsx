import { EXPEDIENT_TYPE } from '@expedients/shared'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { useLocation, useMatches } from 'react-router'
import { queryClient } from '../config/queryClient'

const EXPEDIENT_ROUTES = ['/asesoria', '/empresa']

export const useExpedientsState = () => {
	const location = useLocation()
	const matches = useMatches()

	const getExpedientTypeByRoutePath = (): EXPEDIENT_TYPE => {
		return matches
			.find((match) => EXPEDIENT_ROUTES.includes(match.pathname))
			?.pathname.substring(1) as EXPEDIENT_TYPE
	}

	useEffect(() => {
		setCurrentExpedientType(getExpedientTypeByRoutePath())
	}, [location.pathname])

	const setCurrentExpedientType = (type: EXPEDIENT_TYPE) => {
		return queryClient.setQueryData(['expedientType'], type)
	}

	const currentExpedientType = useQuery<EXPEDIENT_TYPE>({
		queryKey: ['expedientType'],
		enabled: false,
		initialData: getExpedientTypeByRoutePath(),
	}).data

	const isExpedientEmpresa = useMemo(
		() => currentExpedientType?.toUpperCase() === EXPEDIENT_TYPE.EMPRESA,
		[currentExpedientType],
	)

	return {
		isExpedientEmpresa,
		currentExpedientType,
	}
}
