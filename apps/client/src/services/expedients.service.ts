import {
  ICreateExpedientDto,
  IExpedient,
  IPaginationDto,
} from '@expedients/shared'
import { useQuery } from '@tanstack/react-query'
import { httpClient } from '../config/httpClient'
import { useExpedientsState } from '../hooks/useExpedientsState'

const getExpedients = () => {
  const { currentExpedientTypeEndpoint, currentExpedientTypeRoute } =
    useExpedientsState()

  return useQuery({
    queryKey: [currentExpedientTypeRoute],
    queryFn: async (): Promise<IPaginationDto<IExpedient>> => {
      return httpClient
        .get(`${currentExpedientTypeEndpoint}${window.location.search}`)
        .then((res) => res.data)
    },
    enabled: false,
  })
}

export const useExpedientsService = () => {
  const { currentExpedientTypeEndpoint } = useExpedientsState()

  const getExpedient = async (id: string): Promise<IExpedient> => {
    return httpClient
      .get(`${currentExpedientTypeEndpoint}/${id}`)
      .then((res) => res.data)
  }

  const createExpedient = async (expedient: ICreateExpedientDto) => {
    return httpClient
      .post(currentExpedientTypeEndpoint, expedient)
      .then((res) => res.data)
  }

  const updateExpedient = async ({
    id,
    expedient,
  }: {
    id: string
    expedient: ICreateExpedientDto
  }): Promise<any> => {
    return httpClient
      .patch(`${currentExpedientTypeEndpoint}/${id}`, expedient)
      .then((res) => res.data)
  }

  const getExpedientsEvents = async (): Promise<IExpedient[]> => {
    return httpClient.get('expedients/events').then((res) => res.data)
  }

  const getExpedientEvents = async (
    expedientId: string,
  ): Promise<IExpedient> => {
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
