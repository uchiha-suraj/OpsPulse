import type { Service } from '@/types/service'
import { getSeedTimestamp } from './seedTime'

export function createServicesSeed(anchorTime: Date): readonly Service[] {
  return [
    {
      id: 'service-payments-api',
      name: 'Payments API',
      healthStatus: 'major-outage',
      metrics: {
        availabilityPercent: 91.4,
        latencyMs: null,
        errorRatePercent: 8.2,
      },
      updatedAt: getSeedTimestamp(anchorTime, { minutes: 1 }),
    },
    {
      id: 'service-authentication',
      name: 'Authentication Service',
      healthStatus: 'operational',
      metrics: {
        availabilityPercent: 99.99,
        latencyMs: 38,
        errorRatePercent: 0.01,
      },
      updatedAt: getSeedTimestamp(anchorTime, { minutes: 2 }),
    },
    {
      id: 'service-customer-dashboard',
      name: 'Customer Dashboard',
      healthStatus: 'operational',
      metrics: {
        availabilityPercent: 99.97,
        latencyMs: 61,
        errorRatePercent: 0.03,
      },
      updatedAt: getSeedTimestamp(anchorTime, { minutes: 2 }),
    },
    {
      id: 'service-notifications',
      name: 'Notification Service',
      healthStatus: 'degraded',
      metrics: {
        availabilityPercent: 98.1,
        latencyMs: 610,
        errorRatePercent: 1.9,
      },
      updatedAt: getSeedTimestamp(anchorTime, { minutes: 3 }),
    },
    {
      id: 'service-analytics-pipeline',
      name: 'Analytics Pipeline',
      healthStatus: 'operational',
      metrics: {
        availabilityPercent: 99.95,
        latencyMs: 120,
        errorRatePercent: null,
      },
      updatedAt: getSeedTimestamp(anchorTime, { minutes: 5 }),
    },
  ] as const satisfies readonly Service[]
}
