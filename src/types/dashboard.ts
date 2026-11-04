import type { Incident, IncidentSeverity, TimelineEvent } from './incident'
import type { Person } from './person'
import type { Service } from './service'

export const DASHBOARD_RANGE_VALUES = ['24h', '7d', '30d'] as const

export type DashboardRange = (typeof DASHBOARD_RANGE_VALUES)[number]

export interface DashboardMetrics {
  readonly activeIncidentCount: number
  readonly resolvedIncidentCount: number
  readonly meanTimeToAcknowledgeMinutes: number | null
  readonly meanTimeToResolveMinutes: number | null
}

export interface DashboardTrendPoint {
  readonly startedAt: string
  readonly endedAt: string
  readonly openedCount: number
  readonly resolvedCount: number
}

export interface SeverityDistributionItem {
  readonly severity: IncidentSeverity
  readonly count: number
}

export interface RecentIncidentActivity {
  readonly incidentId: string
  readonly incidentTitle: string
  readonly event: TimelineEvent
}

export interface DashboardData {
  readonly range: DashboardRange
  readonly generatedAt: string
  readonly criticalIncident: Incident | null
  readonly metrics: DashboardMetrics
  readonly incidentTrend: readonly DashboardTrendPoint[]
  readonly severityDistribution: readonly SeverityDistributionItem[]
  readonly services: readonly Service[]
  readonly recentActivity: readonly RecentIncidentActivity[]
  readonly onCallResponders: readonly Person[]
}
