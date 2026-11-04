import { http, HttpResponse } from 'msw'
import type { ApiSuccessResponse } from '@/lib/api/apiResponse'
import {
  DASHBOARD_RANGE_VALUES,
  type DashboardData,
  type DashboardRange,
  type DashboardTrendPoint,
} from '@/types/dashboard'
import {
  INCIDENT_SEVERITY_VALUES,
  type Incident,
  type ResolvedIncident,
} from '@/types/incident'
import { delayMockRead } from '../http/mockLatency'
import { handleMockApiError } from '../http/mockApiError'
import { demoDataRepository } from '../persistence/demoDataRepository'

const rangeDurationMs: Record<DashboardRange, number> = {
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
}

const rangeBucketCount: Record<DashboardRange, number> = {
  '24h': 12,
  '7d': 7,
  '30d': 30,
}

function getRange(value: string | null): DashboardRange {
  return DASHBOARD_RANGE_VALUES.includes(value as DashboardRange)
    ? (value as DashboardRange)
    : '24h'
}

function getMean(values: readonly number[]): number | null {
  if (values.length === 0) {
    return null
  }

  const mean = values.reduce((total, value) => total + value, 0) / values.length

  return Math.round(mean)
}

function createIncidentTrend(
  incidents: readonly Incident[],
  range: DashboardRange,
  now: number,
): readonly DashboardTrendPoint[] {
  const duration = rangeDurationMs[range]
  const bucketCount = rangeBucketCount[range]
  const bucketDuration = duration / bucketCount
  const rangeStart = now - duration

  return Array.from({ length: bucketCount }, (_, index) => {
    const bucketStart = rangeStart + index * bucketDuration
    const bucketEnd = bucketStart + bucketDuration
    const includesTimestamp = (timestamp: number) =>
      timestamp >= bucketStart &&
      (index === bucketCount - 1
        ? timestamp <= bucketEnd
        : timestamp < bucketEnd)

    return {
      startedAt: new Date(bucketStart).toISOString(),
      endedAt: new Date(bucketEnd).toISOString(),
      openedCount: incidents.filter((incident) =>
        includesTimestamp(Date.parse(incident.startedAt)),
      ).length,
      resolvedCount: incidents.filter(
        (incident) =>
          incident.status === 'resolved' &&
          includesTimestamp(Date.parse(incident.resolution.resolvedAt)),
      ).length,
    }
  })
}

function createDashboardData(range: DashboardRange, now: Date): DashboardData {
  const data = demoDataRepository.load()
  const nowTimestamp = now.getTime()
  const rangeStart = nowTimestamp - rangeDurationMs[range]
  const activeIncidents = data.incidents.filter(
    (incident) => incident.status !== 'resolved',
  )
  const resolvedInRange = data.incidents.filter(
    (incident): incident is ResolvedIncident =>
      incident.status === 'resolved' &&
      Date.parse(incident.resolution.resolvedAt) >= rangeStart &&
      Date.parse(incident.resolution.resolvedAt) <= nowTimestamp,
  )
  const incidentsStartedInRange = data.incidents.filter((incident) => {
    const startedAt = Date.parse(incident.startedAt)

    return startedAt >= rangeStart && startedAt <= nowTimestamp
  })
  const acknowledgeDurations = incidentsStartedInRange.flatMap((incident) =>
    incident.acknowledgedAt
      ? [
          (Date.parse(incident.acknowledgedAt) -
            Date.parse(incident.createdAt)) /
            60_000,
        ]
      : [],
  )
  const resolveDurations = resolvedInRange.map(
    (incident) =>
      (Date.parse(incident.resolution.resolvedAt) -
        Date.parse(incident.startedAt)) /
      60_000,
  )
  const criticalIncident =
    [...activeIncidents]
      .filter((incident) => incident.severity === 'sev1')
      .sort(
        (first, second) =>
          Date.parse(second.updatedAt) - Date.parse(first.updatedAt),
      )
      .at(0) ?? null
  const recentActivity = data.incidents
    .flatMap((incident) =>
      incident.timeline.map((event) => ({
        incidentId: incident.id,
        incidentTitle: incident.title,
        event,
      })),
    )
    .filter((activity) => Date.parse(activity.event.occurredAt) >= rangeStart)
    .sort(
      (first, second) =>
        Date.parse(second.event.occurredAt) -
        Date.parse(first.event.occurredAt),
    )
    .slice(0, 8)

  return {
    range,
    generatedAt: now.toISOString(),
    criticalIncident,
    metrics: {
      activeIncidentCount: activeIncidents.length,
      resolvedIncidentCount: resolvedInRange.length,
      meanTimeToAcknowledgeMinutes: getMean(acknowledgeDurations),
      meanTimeToResolveMinutes: getMean(resolveDurations),
    },
    incidentTrend: createIncidentTrend(data.incidents, range, nowTimestamp),
    severityDistribution: INCIDENT_SEVERITY_VALUES.map((severity) => ({
      severity,
      count: activeIncidents.filter(
        (incident) => incident.severity === severity,
      ).length,
    })),
    services: data.services,
    recentActivity,
    onCallResponders: data.people.filter(
      (person) => person.availability === 'on-call',
    ),
  }
}

export const dashboardHandlers = [
  http.get('/api/dashboard', async ({ request }) => {
    await delayMockRead()

    try {
      const range = getRange(new URL(request.url).searchParams.get('range'))
      const response = {
        data: createDashboardData(range, new Date()),
      } satisfies ApiSuccessResponse<DashboardData>

      return HttpResponse.json(response)
    } catch (error: unknown) {
      return handleMockApiError(error)
    }
  }),
]
