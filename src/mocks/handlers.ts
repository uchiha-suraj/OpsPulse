import type { RequestHandler } from 'msw'
import { dashboardHandlers } from './handlers/dashboardHandlers'
import { demoHandlers } from './handlers/demoHandlers'
import { incidentHandlers } from './handlers/incidentHandlers'
import { referenceDataHandlers } from './handlers/referenceDataHandlers'

export const handlers: readonly RequestHandler[] = [
  ...referenceDataHandlers,
  ...incidentHandlers,
  ...dashboardHandlers,
  ...demoHandlers,
]
