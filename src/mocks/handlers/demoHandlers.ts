import { http, HttpResponse } from 'msw'
import type { ApiSuccessResponse } from '@/lib/api/apiResponse'
import type { DemoData } from '../data/demoData'
import { handleMockApiError } from '../http/mockApiError'
import { delayMockMutation } from '../http/mockLatency'
import { demoDataRepository } from '../persistence/demoDataRepository'

export const demoHandlers = [
  http.post('/api/demo/reset', async () => {
    await delayMockMutation()

    try {
      const response = {
        data: demoDataRepository.reset(),
      } satisfies ApiSuccessResponse<DemoData>

      return HttpResponse.json(response)
    } catch (error: unknown) {
      return handleMockApiError(error)
    }
  }),
]
