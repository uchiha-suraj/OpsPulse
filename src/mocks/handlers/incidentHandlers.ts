import { http, HttpResponse } from 'msw'
import type {
  ApiSuccessResponse,
  PaginatedApiSuccessResponse,
} from '@/lib/api/apiResponse'
import {
  INCIDENT_SEVERITY_VALUES,
  INCIDENT_STATUS_VALUES,
  type ActiveIncident,
  type Incident,
  type IncidentSeverity,
  type IncidentStatus,
  type ResolvedIncident,
} from '@/types/incident'
import { delayMockMutation, delayMockRead } from '../http/mockLatency'
import { handleMockApiError, MockApiError } from '../http/mockApiError'
import { parseJsonRequest } from '../http/parseRequest'
import { demoDataRepository } from '../persistence/demoDataRepository'
import {
  addInternalNoteRequestSchema,
  addTimelineUpdateRequestSchema,
  changeIncidentStatusRequestSchema,
  createIncidentRequestSchema,
  editIncidentRequestSchema,
  resolveIncidentRequestSchema,
} from './incidentRequestSchemas'
import {
  CURRENT_DEMO_USER_ID,
  findIncidentOrThrow,
  getNextChildId,
  getNextIncidentId,
  getPathParameter,
  replaceIncident,
  validateAffectedServices,
  validateIncidentTeam,
  validateTimestampNotAfter,
  validateTimestampNotBefore,
} from './incidentHandlerUtils'

const INCIDENT_SORT_FIELD_VALUES = [
  'createdAt',
  'updatedAt',
  'severity',
  'status',
  'duration',
] as const

type IncidentSortField = (typeof INCIDENT_SORT_FIELD_VALUES)[number]
type SortOrder = 'asc' | 'desc'

interface IncidentListQuery {
  readonly query: string
  readonly statuses: readonly IncidentStatus[]
  readonly severities: readonly IncidentSeverity[]
  readonly serviceId: string | null
  readonly assigneeId: string | null
  readonly dateFrom: number | null
  readonly dateTo: number | null
  readonly page: number
  readonly pageSize: 10 | 25 | 50
  readonly sort: IncidentSortField
  readonly order: SortOrder
}

const severityRank: Record<IncidentSeverity, number> = {
  sev1: 1,
  sev2: 2,
  sev3: 3,
  sev4: 4,
}

const statusRank: Record<IncidentStatus, number> = {
  investigating: 1,
  identified: 2,
  monitoring: 3,
  resolved: 4,
}

function parseEnumList<TValue extends string>(
  value: string | null,
  allowedValues: readonly TValue[],
): readonly TValue[] {
  if (!value) {
    return []
  }

  const allowed = new Set<string>(allowedValues)

  return [
    ...new Set(value.split(',').filter((item) => allowed.has(item))),
  ] as TValue[]
}

function parsePositiveInteger(value: string | null, fallback: number): number {
  if (!value) {
    return fallback
  }

  const parsed = Number.parseInt(value, 10)

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

function parseDate(value: string | null): number | null {
  if (!value) {
    return null
  }

  const timestamp = Date.parse(value)

  return Number.isFinite(timestamp) ? timestamp : null
}

function parseIncidentListQuery(url: URL): IncidentListQuery {
  const pageSizeCandidate = parsePositiveInteger(
    url.searchParams.get('pageSize'),
    25,
  )
  const pageSize =
    pageSizeCandidate === 10 ||
    pageSizeCandidate === 25 ||
    pageSizeCandidate === 50
      ? pageSizeCandidate
      : 25
  const sortCandidate = url.searchParams.get('sort')
  const sort = INCIDENT_SORT_FIELD_VALUES.includes(
    sortCandidate as IncidentSortField,
  )
    ? (sortCandidate as IncidentSortField)
    : 'updatedAt'

  return {
    query: (url.searchParams.get('q') ?? '').trim().toLocaleLowerCase(),
    statuses: parseEnumList(
      url.searchParams.get('status'),
      INCIDENT_STATUS_VALUES,
    ),
    severities: parseEnumList(
      url.searchParams.get('severity'),
      INCIDENT_SEVERITY_VALUES,
    ),
    serviceId: url.searchParams.get('service'),
    assigneeId: url.searchParams.get('assignee'),
    dateFrom: parseDate(url.searchParams.get('dateFrom')),
    dateTo: parseDate(url.searchParams.get('dateTo')),
    page: parsePositiveInteger(url.searchParams.get('page'), 1),
    pageSize,
    sort,
    order: url.searchParams.get('order') === 'asc' ? 'asc' : 'desc',
  }
}

function getIncidentDuration(incident: Incident, now: number): number {
  const end =
    incident.status === 'resolved'
      ? Date.parse(incident.resolution.resolvedAt)
      : now

  return Math.max(0, end - Date.parse(incident.startedAt))
}

function compareIncidents(
  first: Incident,
  second: Incident,
  sort: IncidentSortField,
  now: number,
): number {
  switch (sort) {
    case 'createdAt':
    case 'updatedAt':
      return Date.parse(first[sort]) - Date.parse(second[sort])
    case 'severity':
      return severityRank[first.severity] - severityRank[second.severity]
    case 'status':
      return statusRank[first.status] - statusRank[second.status]
    case 'duration':
      return getIncidentDuration(first, now) - getIncidentDuration(second, now)
  }
}

function getFilteredIncidents(
  incidents: readonly Incident[],
  query: IncidentListQuery,
  now: number,
): readonly Incident[] {
  const filtered = incidents.filter((incident) => {
    const searchableText = [
      incident.id,
      incident.title,
      incident.description ?? '',
    ]
      .join(' ')
      .toLocaleLowerCase()
    const startedAt = Date.parse(incident.startedAt)

    return (
      (!query.query || searchableText.includes(query.query)) &&
      (query.statuses.length === 0 ||
        query.statuses.includes(incident.status)) &&
      (query.severities.length === 0 ||
        query.severities.includes(incident.severity)) &&
      (!query.serviceId ||
        incident.affectedServiceIds.includes(query.serviceId)) &&
      (!query.assigneeId ||
        incident.commanderId === query.assigneeId ||
        incident.responderIds.includes(query.assigneeId)) &&
      (query.dateFrom === null || startedAt >= query.dateFrom) &&
      (query.dateTo === null || startedAt <= query.dateTo)
    )
  })

  return [...filtered].sort((first, second) => {
    const result = compareIncidents(first, second, query.sort, now)
    const orderedResult = query.order === 'asc' ? result : -result

    return orderedResult !== 0
      ? orderedResult
      : first.id.localeCompare(second.id)
  })
}

function assertActiveIncident(
  incident: Incident,
): asserts incident is ActiveIncident {
  if (incident.status === 'resolved') {
    throw new MockApiError(
      'INVALID_TRANSITION',
      'Resolved incidents cannot be changed through this action.',
      409,
    )
  }
}

export const incidentHandlers = [
  http.get('/api/incidents', async ({ request }) => {
    await delayMockRead()

    try {
      const query = parseIncidentListQuery(new URL(request.url))
      const { incidents } = demoDataRepository.load()
      const filteredIncidents = getFilteredIncidents(
        incidents,
        query,
        Date.now(),
      )
      const total = filteredIncidents.length
      const startIndex = (query.page - 1) * query.pageSize
      const paginatedIncidents = filteredIncidents.slice(
        startIndex,
        startIndex + query.pageSize,
      )
      const response = {
        data: paginatedIncidents,
        meta: {
          page: query.page,
          pageSize: query.pageSize,
          total,
          totalPages: total === 0 ? 0 : Math.ceil(total / query.pageSize),
        },
      } satisfies PaginatedApiSuccessResponse<readonly Incident[]>

      return HttpResponse.json(response)
    } catch (error: unknown) {
      return handleMockApiError(error)
    }
  }),

  http.get('/api/incidents/:incidentId', async ({ params }) => {
    await delayMockRead()

    try {
      const incidentId = getPathParameter(params.incidentId, 'incident ID')
      const { incidents } = demoDataRepository.load()
      const incident = findIncidentOrThrow(incidents, incidentId)
      const response = {
        data: incident,
      } satisfies ApiSuccessResponse<Incident>

      return HttpResponse.json(response)
    } catch (error: unknown) {
      return handleMockApiError(error)
    }
  }),

  http.post('/api/incidents', async ({ request }) => {
    await delayMockMutation()

    try {
      const input = await parseJsonRequest(request, createIncidentRequestSchema)
      const now = new Date().toISOString()
      const incidentId = getNextIncidentId(demoDataRepository.load().incidents)

      const updatedData = demoDataRepository.update((data) => {
        const startedAt = input.startedAt ?? now
        const responderIds = input.responderIds ?? []

        validateTimestampNotAfter(startedAt, now, 'startedAt')
        validateAffectedServices(data, input.affectedServiceIds)
        validateIncidentTeam(data, input.commanderId, responderIds)

        const incident: ActiveIncident = {
          id: incidentId,
          title: input.title,
          description: input.description ?? null,
          severity: input.severity,
          status: 'investigating',
          affectedServiceIds: input.affectedServiceIds,
          region: input.region ?? null,
          commanderId: input.commanderId,
          responderIds,
          createdById: CURRENT_DEMO_USER_ID,
          startedAt,
          acknowledgedAt: null,
          createdAt: now,
          updatedAt: now,
          labels: [],
          relatedLinks: [],
          timeline: [
            {
              id: `${incidentId.toLowerCase()}-timeline-01`,
              incidentId,
              type: 'incident-created',
              message: `${incidentId} was created and investigation started.`,
              actor: {
                kind: 'person',
                personId: CURRENT_DEMO_USER_ID,
              },
              occurredAt: now,
              resultingStatus: 'investigating',
            },
          ],
          internalNotes: [],
          resolution: null,
        }

        return {
          ...data,
          incidents: [incident, ...data.incidents],
        }
      })
      const createdIncident = findIncidentOrThrow(
        updatedData.incidents,
        incidentId,
      )

      assertActiveIncident(createdIncident)

      const response = {
        data: createdIncident,
      } satisfies ApiSuccessResponse<ActiveIncident>

      return HttpResponse.json(response, { status: 201 })
    } catch (error: unknown) {
      return handleMockApiError(error)
    }
  }),

  http.patch('/api/incidents/:incidentId', async ({ params, request }) => {
    await delayMockMutation()

    try {
      const incidentId = getPathParameter(params.incidentId, 'incident ID')
      const input = await parseJsonRequest(request, editIncidentRequestSchema)
      const now = new Date().toISOString()

      const updatedData = demoDataRepository.update((data) => {
        const incident = findIncidentOrThrow(data.incidents, incidentId)
        const affectedServiceIds =
          input.affectedServiceIds ?? incident.affectedServiceIds
        const commanderId = input.commanderId ?? incident.commanderId
        const responderIds = input.responderIds ?? incident.responderIds

        validateAffectedServices(data, affectedServiceIds)
        validateIncidentTeam(data, commanderId, responderIds)

        const updatedIncident: Incident = {
          ...incident,
          ...input,
          affectedServiceIds,
          commanderId,
          responderIds,
          updatedAt: now,
        }

        return replaceIncident(data, updatedIncident)
      })
      const savedIncident = findIncidentOrThrow(
        updatedData.incidents,
        incidentId,
      )

      return HttpResponse.json({ data: savedIncident })
    } catch (error: unknown) {
      return handleMockApiError(error)
    }
  }),

  http.patch(
    '/api/incidents/:incidentId/status',
    async ({ params, request }) => {
      await delayMockMutation()

      try {
        const incidentId = getPathParameter(params.incidentId, 'incident ID')
        const input = await parseJsonRequest(
          request,
          changeIncidentStatusRequestSchema,
        )
        const now = new Date().toISOString()

        const updatedData = demoDataRepository.update((data) => {
          const incident = findIncidentOrThrow(data.incidents, incidentId)

          assertActiveIncident(incident)

          if (incident.status === input.status) {
            throw new MockApiError(
              'INVALID_TRANSITION',
              `Incident ${incidentId} is already ${input.status}.`,
              409,
            )
          }

          const updatedIncident: ActiveIncident = {
            ...incident,
            status: input.status,
            updatedAt: now,
            timeline: [
              ...incident.timeline,
              {
                id: getNextChildId(incident, 'timeline'),
                incidentId,
                type: 'status-changed',
                message: `Status changed from ${incident.status} to ${input.status}.`,
                actor: {
                  kind: 'person',
                  personId: CURRENT_DEMO_USER_ID,
                },
                occurredAt: now,
                resultingStatus: input.status,
              },
            ],
          }

          return replaceIncident(data, updatedIncident)
        })
        const savedIncident = findIncidentOrThrow(
          updatedData.incidents,
          incidentId,
        )

        assertActiveIncident(savedIncident)

        return HttpResponse.json({ data: savedIncident })
      } catch (error: unknown) {
        return handleMockApiError(error)
      }
    },
  ),

  http.post(
    '/api/incidents/:incidentId/timeline',
    async ({ params, request }) => {
      await delayMockMutation()

      try {
        const incidentId = getPathParameter(params.incidentId, 'incident ID')
        const input = await parseJsonRequest(
          request,
          addTimelineUpdateRequestSchema,
        )
        const now = new Date().toISOString()

        const updatedData = demoDataRepository.update((data) => {
          const incident = findIncidentOrThrow(data.incidents, incidentId)

          assertActiveIncident(incident)

          const updatedIncident: ActiveIncident = {
            ...incident,
            updatedAt: now,
            timeline: [
              ...incident.timeline,
              {
                id: getNextChildId(incident, 'timeline'),
                incidentId,
                type: 'timeline-update',
                message: input.message,
                actor: {
                  kind: 'person',
                  personId: CURRENT_DEMO_USER_ID,
                },
                occurredAt: now,
                resultingStatus: null,
              },
            ],
          }

          return replaceIncident(data, updatedIncident)
        })
        const savedIncident = findIncidentOrThrow(
          updatedData.incidents,
          incidentId,
        )

        assertActiveIncident(savedIncident)

        return HttpResponse.json({ data: savedIncident }, { status: 201 })
      } catch (error: unknown) {
        return handleMockApiError(error)
      }
    },
  ),

  http.post('/api/incidents/:incidentId/notes', async ({ params, request }) => {
    await delayMockMutation()

    try {
      const incidentId = getPathParameter(params.incidentId, 'incident ID')
      const input = await parseJsonRequest(
        request,
        addInternalNoteRequestSchema,
      )
      const now = new Date().toISOString()

      const updatedData = demoDataRepository.update((data) => {
        const incident = findIncidentOrThrow(data.incidents, incidentId)
        const updatedIncident: Incident = {
          ...incident,
          updatedAt: now,
          internalNotes: [
            ...incident.internalNotes,
            {
              id: getNextChildId(incident, 'note'),
              incidentId,
              content: input.content,
              authorId: CURRENT_DEMO_USER_ID,
              createdAt: now,
            },
          ],
        }

        return replaceIncident(data, updatedIncident)
      })
      const savedIncident = findIncidentOrThrow(
        updatedData.incidents,
        incidentId,
      )

      return HttpResponse.json({ data: savedIncident }, { status: 201 })
    } catch (error: unknown) {
      return handleMockApiError(error)
    }
  }),

  http.post(
    '/api/incidents/:incidentId/resolve',
    async ({ params, request }) => {
      await delayMockMutation()

      try {
        const incidentId = getPathParameter(params.incidentId, 'incident ID')
        const input = await parseJsonRequest(
          request,
          resolveIncidentRequestSchema,
        )
        const now = new Date().toISOString()

        const updatedData = demoDataRepository.update((data) => {
          const incident = findIncidentOrThrow(data.incidents, incidentId)

          assertActiveIncident(incident)

          const resolvedAt = input.resolvedAt ?? now

          validateTimestampNotBefore(
            resolvedAt,
            incident.createdAt,
            'resolvedAt',
          )
          validateTimestampNotAfter(resolvedAt, now, 'resolvedAt')

          const updatedIncident: ResolvedIncident = {
            ...incident,
            status: 'resolved',
            updatedAt: now,
            resolution: {
              summary: input.summary,
              rootCause: input.rootCause ?? null,
              resolvedById: CURRENT_DEMO_USER_ID,
              resolvedAt,
            },
            timeline: [
              ...incident.timeline,
              {
                id: getNextChildId(incident, 'timeline'),
                incidentId,
                type: 'incident-resolved',
                message: input.summary,
                actor: {
                  kind: 'person',
                  personId: CURRENT_DEMO_USER_ID,
                },
                occurredAt: resolvedAt,
                resultingStatus: 'resolved',
              },
            ],
          }

          return replaceIncident(data, updatedIncident)
        })
        const savedIncident = findIncidentOrThrow(
          updatedData.incidents,
          incidentId,
        )

        if (savedIncident.status !== 'resolved') {
          throw new Error('The incident was not resolved.')
        }

        return HttpResponse.json({ data: savedIncident })
      } catch (error: unknown) {
        return handleMockApiError(error)
      }
    },
  ),
]
