import {
  EXPEDIENT_TYPE_CODE_NAME,
  EXPEDIENT_TYPE_FRONTEND_TO_BACKEND_ENDPOINT,
  EXPEDIENT_TYPE_NAME_SINGULAR,
  FRONTEND_ROUTES_AS_EXPEDIENT_TYPE_NAME,
  TYPE_EXPEDIENT_FRONTEND_ROUTES,
} from '@expedients/shared'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { useLocation, useMatches } from 'react-router'
import { queryClient } from '../config/queryClient'

export const useExpedientsState = () => {
  const location = useLocation()
  const matches = useMatches()

  const getExpedientTypeByRoutePath = (): TYPE_EXPEDIENT_FRONTEND_ROUTES =>
    matches
      .find((match) =>
        Object.keys(FRONTEND_ROUTES_AS_EXPEDIENT_TYPE_NAME).includes(
          match.pathname.substring(1),
        ),
      )
      ?.pathname.substring(1) as TYPE_EXPEDIENT_FRONTEND_ROUTES

  useEffect(() => {
    setcurrentExpedientTypeRoute(getExpedientTypeByRoutePath())
  }, [location.pathname])

  const setcurrentExpedientTypeRoute = (
    type: TYPE_EXPEDIENT_FRONTEND_ROUTES,
  ) => {
    return queryClient.setQueryData(['expedientType'], type)
  }

  const currentExpedientTypeRoute = useQuery<TYPE_EXPEDIENT_FRONTEND_ROUTES>({
    queryKey: ['expedientType'],
    queryFn: () => Promise.resolve(getExpedientTypeByRoutePath()),
    initialData: getExpedientTypeByRoutePath(),
  }).data

  const currentExpedientTypeName = useMemo(
    () => FRONTEND_ROUTES_AS_EXPEDIENT_TYPE_NAME[currentExpedientTypeRoute],
    [currentExpedientTypeRoute],
  )

  const currentExpedientTypeNameSingular = useMemo(
    () => EXPEDIENT_TYPE_NAME_SINGULAR[currentExpedientTypeRoute],
    [currentExpedientTypeRoute],
  )

  const currentExpedientTypeEndpoint = useMemo(
    () =>
      EXPEDIENT_TYPE_FRONTEND_TO_BACKEND_ENDPOINT[currentExpedientTypeRoute],
    [currentExpedientTypeRoute],
  )

  const currentExpedientTypeCodeName = useMemo(
    () => EXPEDIENT_TYPE_CODE_NAME[currentExpedientTypeRoute],
    [currentExpedientTypeRoute],
  )

  return {
    currentExpedientTypeRoute,
    currentExpedientTypeName,
    currentExpedientTypeNameSingular,
    currentExpedientTypeEndpoint,
    currentExpedientTypeCodeName,
  }
}
