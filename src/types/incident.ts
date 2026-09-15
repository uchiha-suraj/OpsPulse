import type { PersonId } from '@/types/person'
import type { ServiceId } from '@/types/service'

export const INCIDENT_SEVERITY_VALUES = [
  'sev1',
  'sev2',
  'sev3',
  'sev4',
] as const

export type IncidentSeverity = (typeof INCIDENT_SEVERITY_VALUES)[number]

export const INCIDENT_SEVERITY_LABELS = {
  sev1: 'SEV-1 — Critical',
  sev2: 'SEV-2 — High',
  sev3: 'SEV-3 — Medium',
  sev4: 'SEV-4 — Low',
} as const satisfies Record<IncidentSeverity, string>

export const ACTIVE_INCIDENT_STATUS_VALUES = [
  'investigating',
  'identified',
  'monitoring',
] as const

export type ActiveIncidentStatus =
  (typeof ACTIVE_INCIDENT_STATUS_VALUES)[number]

export const INCIDENT_STATUS_VALUES = [
  ...ACTIVE_INCIDENT_STATUS_VALUES,
  'resolved',
] as const

export type IncidentStatus = (typeof INCIDENT_STATUS_VALUES)[number]

export const INCIDENT_STATUS_LABELS = {
  investigating: 'Investigating',
  identified: 'Identified',
  monitoring: 'Monitoring',
  resolved: 'Resolved',
} as const satisfies Record<IncidentStatus, string>

export const TIMELINE_EVENT_TYPE_VALUES = [
  'incident-created',
  'status-changed',
  'timeline-update',
  'incident-resolved',
] as const

export type TimelineEventType = (typeof TIMELINE_EVENT_TYPE_VALUES)[number]

export const TIMELINE_EVENT_TYPE_LABELS = {
  'incident-created': 'Incident created',
  'status-changed': 'Status changed',
  'timeline-update': 'Timeline update',
  'incident-resolved': 'Incident resolved',
} as const satisfies Record<TimelineEventType, string>

export const RELATED_LINK_KIND_VALUES = [
  'datadog',
  'grafana',
  'slack',
  'runbook',
  'other',
] as const

export type RelatedLinkKind = (typeof RELATED_LINK_KIND_VALUES)[number]

export const RELATED_LINK_KIND_LABELS = {
  datadog: 'Datadog',
  grafana: 'Grafana',
  slack: 'Slack',
  runbook: 'Runbook',
  other: 'Other',
} as const satisfies Record<RelatedLinkKind, string>

export type IncidentId = string
export type TimelineEventId = string
export type InternalNoteId = string
export type RelatedLinkId = string

export type TimelineActor =
  | {
      readonly kind: 'person'
      readonly personId: PersonId
    }
  | {
      readonly kind: 'system'
      readonly label: string
    }

export interface TimelineEvent {
  readonly id: TimelineEventId
  readonly incidentId: IncidentId
  readonly type: TimelineEventType
  readonly message: string
  readonly actor: TimelineActor
  readonly occurredAt: string
  readonly resultingStatus: IncidentStatus | null
}

export interface InternalNote {
  readonly id: InternalNoteId
  readonly incidentId: IncidentId
  readonly content: string
  readonly authorId: PersonId
  readonly createdAt: string
}

export interface IncidentResolution {
  readonly summary: string
  readonly rootCause: string | null
  readonly resolvedById: PersonId
  readonly resolvedAt: string
}

export interface RelatedLink {
  readonly id: RelatedLinkId
  readonly label: string
  readonly url: string
  readonly kind: RelatedLinkKind
}

interface IncidentBase {
  readonly id: IncidentId
  readonly title: string
  readonly description: string | null
  readonly severity: IncidentSeverity
  readonly affectedServiceIds: readonly ServiceId[]
  readonly region: string | null
  readonly commanderId: PersonId
  readonly responderIds: readonly PersonId[]
  readonly createdById: PersonId
  readonly startedAt: string
  readonly acknowledgedAt: string | null
  readonly createdAt: string
  readonly updatedAt: string
  readonly labels: readonly string[]
  readonly relatedLinks: readonly RelatedLink[]
  readonly timeline: readonly TimelineEvent[]
  readonly internalNotes: readonly InternalNote[]
}

export interface ActiveIncident extends IncidentBase {
  readonly status: ActiveIncidentStatus
  readonly resolution: null
}

export interface ResolvedIncident extends IncidentBase {
  readonly status: 'resolved'
  readonly resolution: IncidentResolution
}

export type Incident = ActiveIncident | ResolvedIncident
