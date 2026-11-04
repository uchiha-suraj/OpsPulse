import { z } from 'zod'
import type { ApiFieldErrors } from '@/lib/api/apiResponse'
import { MockApiError } from './mockApiError'

function getFieldErrors(error: z.ZodError): ApiFieldErrors {
  const fieldErrors: Record<string, string[]> = {}

  for (const issue of error.issues) {
    const field = issue.path.length > 0 ? issue.path.join('.') : 'request'

    fieldErrors[field] ??= []
    fieldErrors[field].push(issue.message)
  }

  return fieldErrors
}

export function parseRequest<TSchema extends z.ZodType>(
  schema: TSchema,
  value: unknown,
): z.output<TSchema> {
  const result = schema.safeParse(value)

  if (!result.success) {
    throw new MockApiError(
      'VALIDATION_ERROR',
      'Please correct the invalid request data.',
      400,
      getFieldErrors(result.error),
    )
  }

  return result.data
}

export async function parseJsonRequest<TSchema extends z.ZodType>(
  request: Request,
  schema: TSchema,
): Promise<z.output<TSchema>> {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    throw new MockApiError(
      'VALIDATION_ERROR',
      'The request body must contain valid JSON.',
      400,
      { request: ['Expected a valid JSON request body.'] },
    )
  }

  return parseRequest(schema, body)
}
