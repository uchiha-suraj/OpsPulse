import type { DemoData } from '../data/demoData'
import type {
  Incident,
  IncidentId,
  InternalNoteId,
  TimelineEventId,
} from '@/types/incident'
import type { PersonId } from '@/types/person'
import type { ServiceId } from '@/types/service'
import { MockApiError } from '../http/mockApiError'

export const CURRENT_DEMO_USER_ID = 'person-ananya-rao'

type IncidentChildKind = 'note' | 'timeline'

function throwFieldError(field: string, message: string): never {
  throw new MockApiError(
    'VALIDATION_ERROR',
    'Please correct the invalid request data.',
    400,
    { [field]: [message] },
  )
}

export function getPathParameter(
  value: string | readonly string[] | undefined,
  parameterName: string,
): string {
  if (typeof value === 'string' && value.length > 0) {
    return value
  }

  throw new MockApiError(
    'VALIDATION_ERROR',
    `A valid ${parameterName} is required.`,
    400,
  )
}

export function findIncidentOrThrow(
  incidents: readonly Incident[],
  incidentId: IncidentId,
): Incident {
  const incident = incidents.find((candidate) => candidate.id === incidentId)

  if (!incident) {
    throw new MockApiError(
      'NOT_FOUND',
      `Incident ${incidentId} was not found.`,
      404,
    )
  }

  return incident
}

export function replaceIncident(
  data: DemoData,
  updatedIncident: Incident,
): DemoData {
  return {
    ...data,
    incidents: data.incidents.map((incident) =>
      incident.id === updatedIncident.id ? updatedIncident : incident,
    ),
  }
}

export function validateAffectedServices(
  data: DemoData,
  serviceIds: readonly ServiceId[],
): void {
  if (new Set(serviceIds).size !== serviceIds.length) {
    throwFieldError(
      'affectedServiceIds',
      'Affected services must not contain duplicates.',
    )
  }

  const knownServiceIds = new Set(data.services.map((service) => service.id))

  for (const serviceId of serviceIds) {
    if (!knownServiceIds.has(serviceId)) {
      throwFieldError(
        'affectedServiceIds',
        `Unknown affected service: ${serviceId}.`,
      )
    }
  }
}

export function validateIncidentTeam(
  data: DemoData,
  commanderId: PersonId,
  responderIds: readonly PersonId[],
): void {
  const peopleById = new Map(data.people.map((person) => [person.id, person]))
  const commander = peopleById.get(commanderId)

  if (!commander) {
    throwFieldError(
      'commanderId',
      `Unknown incident commander: ${commanderId}.`,
    )
  }

  if (commander.availability === 'unavailable') {
    throwFieldError(
      'commanderId',
      'The incident commander must be on call or available.',
    )
  }

  if (new Set(responderIds).size !== responderIds.length) {
    throwFieldError('responderIds', 'Responders must not contain duplicates.')
  }

  if (responderIds.includes(commanderId)) {
    throwFieldError(
      'responderIds',
      'The incident commander cannot also be listed as a responder.',
    )
  }

  for (const responderId of responderIds) {
    if (!peopleById.has(responderId)) {
      throwFieldError('responderIds', `Unknown responder: ${responderId}.`)
    }
  }
}

export function validateTimestampNotAfter(
  value: string,
  latestValue: string,
  field: string,
): void {
  if (Date.parse(value) > Date.parse(latestValue)) {
    throwFieldError(field, 'The timestamp cannot be in the future.')
  }
}

export function validateTimestampNotBefore(
  value: string,
  earliestValue: string,
  field: string,
): void {
  if (Date.parse(value) < Date.parse(earliestValue)) {
    throwFieldError(field, 'The timestamp is earlier than the allowed range.')
  }
}

export function getNextIncidentId(incidents: readonly Incident[]): IncidentId {
  const highestSequence = incidents.reduce((highest, incident) => {
    const sequence = Number.parseInt(incident.id.replace(/^INC-/, ''), 10)

    return Number.isFinite(sequence) ? Math.max(highest, sequence) : highest
  }, 0)

  return `INC-${String(highestSequence + 1)}`
}

export function getNextChildId(
  incident: Incident,
  kind: 'timeline',
): TimelineEventId
export function getNextChildId(incident: Incident, kind: 'note'): InternalNoteId
export function getNextChildId(
  incident: Incident,
  kind: IncidentChildKind,
): string {
  const childCount =
    kind === 'timeline'
      ? incident.timeline.length
      : incident.internalNotes.length
  const sequence = String(childCount + 1).padStart(2, '0')

  return `${incident.id.toLowerCase()}-${kind}-${sequence}`
}
