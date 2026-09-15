export const SERVICE_HEALTH_STATUS_VALUES = [
  'operational',
  'degraded',
  'major-outage',
] as const

export type ServiceHealthStatus = (typeof SERVICE_HEALTH_STATUS_VALUES)[number]

export const SERVICE_HEALTH_STATUS_LABELS = {
  operational: 'Operational',
  degraded: 'Degraded',
  'major-outage': 'Major outage',
} as const satisfies Record<ServiceHealthStatus, string>

export type ServiceId = string

export interface ServiceMetrics {
  readonly availabilityPercent: number
  readonly latencyMs: number | null
  readonly errorRatePercent: number | null
}

export interface Service {
  readonly id: ServiceId
  readonly name: string
  readonly healthStatus: ServiceHealthStatus
  readonly metrics: ServiceMetrics
  readonly updatedAt: string
}
