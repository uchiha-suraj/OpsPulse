import type { DemoData } from './demoData'

interface IdentifiableRecord {
  readonly id: string
}

function assertUniqueIds(
  records: readonly IdentifiableRecord[],
  recordType: string,
): void {
  const ids = new Set<string>()

  for (const record of records) {
    if (ids.has(record.id)) {
      throw new Error(`Duplicate ${recordType} ID: ${record.id}`)
    }

    ids.add(record.id)
  }
}

function assertKnownId(
  knownIds: ReadonlySet<string>,
  id: string,
  context: string,
): void {
  if (!knownIds.has(id)) {
    throw new Error(`${context} references unknown ID: ${id}`)
  }
}

function parseTimestamp(value: string, context: string): number {
  const timestamp = Date.parse(value)

  if (!Number.isFinite(timestamp)) {
    throw new RangeError(`${context} contains an invalid timestamp: ${value}`)
  }

  return timestamp
}

function assertTimestampRange(
  timestamp: number,
  earliest: number,
  latest: number,
  context: string,
): void {
  if (timestamp < earliest || timestamp > latest) {
    throw new RangeError(`${context} is outside the incident time range`)
  }
}

export function validateDemoData(data: DemoData): void {
  assertUniqueIds(data.people, 'person')
  assertUniqueIds(data.services, 'service')
  assertUniqueIds(data.incidents, 'incident')

  const personIds = new Set(data.people.map((person) => person.id))
  const serviceIds = new Set(data.services.map((service) => service.id))
  const seededAt = parseTimestamp(data.seededAt, 'Demo data')

  for (const service of data.services) {
    const updatedAt = parseTimestamp(service.updatedAt, `Service ${service.id}`)

    if (updatedAt > seededAt) {
      throw new RangeError(
        `Service ${service.id} was updated after the seed anchor`,
      )
    }
  }

  const timelineIds = new Set<string>()
  const noteIds = new Set<string>()
  const linkIds = new Set<string>()

  for (const incident of data.incidents) {
    const context = `Incident ${incident.id}`

    assertKnownId(personIds, incident.commanderId, `${context} commander`)
    assertKnownId(personIds, incident.createdById, `${context} creator`)

    if (incident.affectedServiceIds.length === 0) {
      throw new Error(`${context} must affect at least one service`)
    }

    if (
      new Set(incident.affectedServiceIds).size !==
      incident.affectedServiceIds.length
    ) {
      throw new Error(`${context} contains duplicate affected services`)
    }

    for (const serviceId of incident.affectedServiceIds) {
      assertKnownId(serviceIds, serviceId, `${context} affected service`)
    }

    if (new Set(incident.responderIds).size !== incident.responderIds.length) {
      throw new Error(`${context} contains duplicate responders`)
    }

    if (incident.responderIds.includes(incident.commanderId)) {
      throw new Error(`${context} includes its commander as a responder`)
    }

    for (const responderId of incident.responderIds) {
      assertKnownId(personIds, responderId, `${context} responder`)
    }

    const startedAt = parseTimestamp(incident.startedAt, context)
    const createdAt = parseTimestamp(incident.createdAt, context)
    const updatedAt = parseTimestamp(incident.updatedAt, context)

    if (createdAt < startedAt) {
      throw new RangeError(`${context} was created before it started`)
    }

    if (updatedAt < createdAt || updatedAt > seededAt) {
      throw new RangeError(`${context} has an invalid updated timestamp`)
    }

    if (incident.acknowledgedAt) {
      const acknowledgedAt = parseTimestamp(incident.acknowledgedAt, context)

      assertTimestampRange(
        acknowledgedAt,
        createdAt,
        updatedAt,
        `${context} acknowledgement`,
      )
    }

    if (incident.timeline.length === 0) {
      throw new Error(`${context} must contain at least one timeline event`)
    }

    for (const event of incident.timeline) {
      if (timelineIds.has(event.id)) {
        throw new Error(`Duplicate timeline event ID: ${event.id}`)
      }

      timelineIds.add(event.id)

      if (event.incidentId !== incident.id) {
        throw new Error(
          `Timeline event ${event.id} belongs to the wrong incident`,
        )
      }

      if (event.actor.kind === 'person') {
        assertKnownId(
          personIds,
          event.actor.personId,
          `Timeline event ${event.id} actor`,
        )
      }

      const occurredAt = parseTimestamp(
        event.occurredAt,
        `Timeline event ${event.id}`,
      )

      assertTimestampRange(
        occurredAt,
        startedAt,
        updatedAt,
        `Timeline event ${event.id}`,
      )
    }

    for (const note of incident.internalNotes) {
      if (noteIds.has(note.id)) {
        throw new Error(`Duplicate internal note ID: ${note.id}`)
      }

      noteIds.add(note.id)

      if (note.incidentId !== incident.id) {
        throw new Error(
          `Internal note ${note.id} belongs to the wrong incident`,
        )
      }

      assertKnownId(personIds, note.authorId, `Internal note ${note.id} author`)

      const noteCreatedAt = parseTimestamp(
        note.createdAt,
        `Internal note ${note.id}`,
      )

      assertTimestampRange(
        noteCreatedAt,
        createdAt,
        updatedAt,
        `Internal note ${note.id}`,
      )
    }

    for (const link of incident.relatedLinks) {
      if (linkIds.has(link.id)) {
        throw new Error(`Duplicate related link ID: ${link.id}`)
      }

      linkIds.add(link.id)
    }

    if (incident.status === 'resolved') {
      assertKnownId(
        personIds,
        incident.resolution.resolvedById,
        `${context} resolver`,
      )

      const resolvedAt = parseTimestamp(
        incident.resolution.resolvedAt,
        `${context} resolution`,
      )

      assertTimestampRange(
        resolvedAt,
        createdAt,
        updatedAt,
        `${context} resolution`,
      )
    }
  }
}
