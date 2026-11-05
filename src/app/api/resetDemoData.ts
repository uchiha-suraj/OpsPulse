function getApiErrorMessage(value: unknown): string | null {
  if (typeof value !== 'object' || value === null || !('error' in value)) {
    return null
  }

  const error = value.error

  if (typeof error !== 'object' || error === null || !('message' in error)) {
    return null
  }

  return typeof error.message === 'string' && error.message.length > 0
    ? error.message
    : null
}

export async function resetDemoData(): Promise<void> {
  let response: Response

  try {
    response = await fetch('/api/demo/reset', {
      method: 'POST',
    })
  } catch (error: unknown) {
    throw new Error('Unable to reach the demo-data service.', {
      cause: error,
    })
  }

  if (response.ok) {
    return
  }

  let message = 'Unable to reset the demo data.'

  try {
    const body = (await response.json()) as unknown
    message = getApiErrorMessage(body) ?? message
  } catch {
    // Preserve the stable fallback when the response is not JSON.
  }

  throw new Error(message)
}
