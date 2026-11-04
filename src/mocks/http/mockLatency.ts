import { delay } from 'msw'

export const MOCK_API_DELAY_MS = {
  read: 300,
  mutation: 500,
} as const

export function delayMockRead(): Promise<void> {
  return delay(MOCK_API_DELAY_MS.read)
}

export function delayMockMutation(): Promise<void> {
  return delay(MOCK_API_DELAY_MS.mutation)
}
