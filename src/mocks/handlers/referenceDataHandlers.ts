import { http, HttpResponse } from 'msw'
import type { ApiSuccessResponse } from '@/lib/api/apiResponse'
import type { Person } from '@/types/person'
import type { Service } from '@/types/service'
import { delayMockRead } from '../http/mockLatency'
import { handleMockApiError } from '../http/mockApiError'
import { demoDataRepository } from '../persistence/demoDataRepository'

export const referenceDataHandlers = [
  http.get('/api/people', async () => {
    await delayMockRead()

    try {
      const { people } = demoDataRepository.load()
      const response = {
        data: people,
      } satisfies ApiSuccessResponse<readonly Person[]>

      return HttpResponse.json(response)
    } catch (error: unknown) {
      return handleMockApiError(error)
    }
  }),

  http.get('/api/services', async () => {
    await delayMockRead()

    try {
      const { services } = demoDataRepository.load()
      const response = {
        data: services,
      } satisfies ApiSuccessResponse<readonly Service[]>

      return HttpResponse.json(response)
    } catch (error: unknown) {
      return handleMockApiError(error)
    }
  }),
]
