import type {
  Incident,
  InternalNote,
  RelatedLink,
  TimelineEvent,
} from '@/types/incident'
import { getSeedTimestamp } from '../seedTime'
import type {
  IncidentSeedDefinition,
  IncidentTimelineEventSeedDefinition,
} from './incidentSeedDefinitions'

type IncidentChildKind = 'link' | 'note' | 'timeline'

function createChildId(
  incidentId: string,
  kind: IncidentChildKind,
  index: number,
): string {
  const sequence = String(index + 1).padStart(2, '0')

  return `${incidentId.toLowerCase()}-${kind}-${sequence}`
}

function getTimelineDefinitions(
  definition: IncidentSeedDefinition,
): readonly IncidentTimelineEventSeedDefinition[] {
  if (definition.timelineEvents) {
    return definition.timelineEvents
  }

  const creationEvent = {
    type: 'incident-created',
    message: `${definition.id} was created`,
    actor: {
      kind: 'person',
      personId: definition.createdById,
    },
    occurredAtOffset: definition.createdAtOffset,
    resultingStatus:
      definition.status === 'resolved' ? 'investigating' : definition.status,
  } as const satisfies IncidentTimelineEventSeedDefinition

  if (definition.status !== 'resolved') {
    return [creationEvent]
  }

  const resolutionEvent = {
    type: 'incident-resolved',
    message: definition.resolution.summary,
    actor: {
      kind: 'person',
      personId: definition.resolution.resolvedById,
    },
    occurredAtOffset: definition.resolution.resolvedAtOffset,
    resultingStatus: 'resolved',
  } as const satisfies IncidentTimelineEventSeedDefinition

  return [creationEvent, resolutionEvent]
}

function createTimeline(
  definition: IncidentSeedDefinition,
  anchorTime: Date,
): readonly TimelineEvent[] {
  return getTimelineDefinitions(definition).map((event, index) => ({
    id: createChildId(definition.id, 'timeline', index),
    incidentId: definition.id,
    type: event.type,
    message: event.message,
    actor: event.actor,
    occurredAt: getSeedTimestamp(anchorTime, event.occurredAtOffset),
    resultingStatus: event.resultingStatus,
  }))
}

function createInternalNotes(
  definition: IncidentSeedDefinition,
  anchorTime: Date,
): readonly InternalNote[] {
  return (definition.internalNotes ?? []).map((note, index) => ({
    id: createChildId(definition.id, 'note', index),
    incidentId: definition.id,
    content: note.content,
    authorId: note.authorId,
    createdAt: getSeedTimestamp(anchorTime, note.createdAtOffset),
  }))
}

function createRelatedLinks(
  definition: IncidentSeedDefinition,
): readonly RelatedLink[] {
  return (definition.relatedLinks ?? []).map((link, index) => ({
    id: createChildId(definition.id, 'link', index),
    label: link.label,
    url: link.url,
    kind: link.kind,
  }))
}

export function createIncidentFromSeed(
  definition: IncidentSeedDefinition,
  anchorTime: Date,
): Incident {
  const incidentBase = {
    id: definition.id,
    title: definition.title,
    description: definition.description,
    severity: definition.severity,
    affectedServiceIds: [...definition.affectedServiceIds],
    region: definition.region,
    commanderId: definition.commanderId,
    responderIds: [...definition.responderIds],
    createdById: definition.createdById,
    startedAt: getSeedTimestamp(anchorTime, definition.startedAtOffset),
    acknowledgedAt: definition.acknowledgedAtOffset
      ? getSeedTimestamp(anchorTime, definition.acknowledgedAtOffset)
      : null,
    createdAt: getSeedTimestamp(anchorTime, definition.createdAtOffset),
    updatedAt: getSeedTimestamp(anchorTime, definition.updatedAtOffset),
    labels: [...definition.labels],
    relatedLinks: createRelatedLinks(definition),
    timeline: createTimeline(definition, anchorTime),
    internalNotes: createInternalNotes(definition, anchorTime),
  }

  if (definition.status === 'resolved') {
    return {
      ...incidentBase,
      status: 'resolved',
      resolution: {
        summary: definition.resolution.summary,
        rootCause: definition.resolution.rootCause,
        resolvedById: definition.resolution.resolvedById,
        resolvedAt: getSeedTimestamp(
          anchorTime,
          definition.resolution.resolvedAtOffset,
        ),
      },
    }
  }

  return {
    ...incidentBase,
    status: definition.status,
    resolution: null,
  }
}
