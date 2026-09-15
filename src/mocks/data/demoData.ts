import type { Incident } from '@/types/incident'
import type { Person } from '@/types/person'
import type { Service } from '@/types/service'

export const DEMO_DATA_VERSION = 1 as const

export interface DemoData {
  readonly version: typeof DEMO_DATA_VERSION
  readonly seededAt: string
  readonly people: readonly Person[]
  readonly services: readonly Service[]
  readonly incidents: readonly Incident[]
}
