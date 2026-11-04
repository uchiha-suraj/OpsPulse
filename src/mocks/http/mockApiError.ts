import { HttpResponse } from 'msw'
import type {
  ApiErrorCode,
  ApiErrorResponse,
  ApiFieldErrors,
} from '@/lib/api/apiResponse'
import { DemoDataPersistenceError } from '../persistence/persistenceError'

type ApiErrorStatus = 400 | 404 | 409 | 500 | 503

export class MockApiError extends Error {
  readonly code: ApiErrorCode
  readonly status: ApiErrorStatus
  readonly fieldErrors: ApiFieldErrors | null

  constructor(
    code: ApiErrorCode,
    message: string,
    status: ApiErrorStatus,
    fieldErrors: ApiFieldErrors | null = null,
  ) {
    super(message)

    this.name = 'MockApiError'
    this.code = code
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

function createErrorResponse(
  code: ApiErrorCode,
  message: string,
  status: ApiErrorStatus,
  fieldErrors: ApiFieldErrors | null = null,
) {
  const response = {
    error: {
      code,
      message,
      fieldErrors,
    },
  } satisfies ApiErrorResponse

  return HttpResponse.json(response, { status })
}

export function handleMockApiError(error: unknown) {
  if (error instanceof MockApiError) {
    return createErrorResponse(
      error.code,
      error.message,
      error.status,
      error.fieldErrors,
    )
  }

  if (error instanceof DemoDataPersistenceError) {
    console.error('The OpsPulse demo-data repository is unavailable.', error)

    return createErrorResponse(
      'PERSISTENCE_UNAVAILABLE',
      'Demo data is temporarily unavailable. Please try again.',
      503,
    )
  }

  console.error('An unexpected mock API error occurred.', error)

  return createErrorResponse(
    'INTERNAL_ERROR',
    'An unexpected error occurred. Please try again.',
    500,
  )
}
