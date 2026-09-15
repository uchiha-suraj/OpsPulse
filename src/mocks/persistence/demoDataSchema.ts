import * as z from 'zod'
import {
  ACTIVE_INCIDENT_STATUS_VALUES,
  INCIDENT_SEVERITY_VALUES,
  INCIDENT_STATUS_VALUES,
  RELATED_LINK_KIND_VALUES,
  TIMELINE_EVENT_TYPE_VALUES,
} from '@/types/incident'
import { PERSON_AVAILABILITY_VALUES } from '@/types/person'
import { SERVICE_HEALTH_STATUS_VALUES } from '@/types/service'
import { DEMO_DATA_VERSION, type DemoData } from '../data/demoData'
import { validateDemoData } from '../data/validateDemoData'

const identifierSchema = z.string().min(1)
const timestampSchema = z.iso.datetime()

const personSchema = z.strictObject({
  id: identifierSchema,
  name: z.string().min(1),
  initials: z.string().min(1),
  role: z.string().min(1),
  availability: z.enum(PERSON_AVAILABILITY_VALUES),
})

const serviceMetricsSchema = z.strictObject({
  availabilityPercent: z.number().min(0).max(100),
  latencyMs: z.number().nonnegative().nullable(),
  errorRatePercent: z.number().min(0).max(100).nullable(),
})

const serviceSchema = z.strictObject({
  id: identifierSchema,
  name: z.string().min(1),
  healthStatus: z.enum(SERVICE_HEALTH_STATUS_VALUES),
  metrics: serviceMetricsSchema,
  updatedAt: timestampSchema,
})

const timelineActorSchema = z.discriminatedUnion('kind', [
  z.strictObject({
    kind: z.literal('person'),
    personId: identifierSchema,
  }),
  z.strictObject({
    kind: z.literal('system'),
    label: z.string().min(1),
  }),
])

const timelineEventSchema = z.strictObject({
  id: identifierSchema,
  incidentId: identifierSchema,
  type: z.enum(TIMELINE_EVENT_TYPE_VALUES),
  message: z.string().min(1),
  actor: timelineActorSchema,
  occurredAt: timestampSchema,
  resultingStatus: z.enum(INCIDENT_STATUS_VALUES).nullable(),
})

const internalNoteSchema = z.strictObject({
  id: identifierSchema,
  incidentId: identifierSchema,
  content: z.string().min(1),
  authorId: identifierSchema,
  createdAt: timestampSchema,
})

const relatedLinkSchema = z.strictObject({
  id: identifierSchema,
  label: z.string().min(1),
  url: z.url(),
  kind: z.enum(RELATED_LINK_KIND_VALUES),
})

const incidentResolutionSchema = z.strictObject({
  summary: z.string().min(1),
  rootCause: z.string().min(1).nullable(),
  resolvedById: identifierSchema,
  resolvedAt: timestampSchema,
})

const incidentBaseShape = {
  id: identifierSchema,
  title: z.string().min(1),
  description: z.string().min(1).nullable(),
  severity: z.enum(INCIDENT_SEVERITY_VALUES),
  affectedServiceIds: z.array(identifierSchema),
  region: z.string().min(1).nullable(),
  commanderId: identifierSchema,
  responderIds: z.array(identifierSchema),
  createdById: identifierSchema,
  startedAt: timestampSchema,
  acknowledgedAt: timestampSchema.nullable(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  labels: z.array(z.string().min(1)),
  relatedLinks: z.array(relatedLinkSchema),
  timeline: z.array(timelineEventSchema),
  internalNotes: z.array(internalNoteSchema),
}

const activeIncidentSchema = z.strictObject({
  ...incidentBaseShape,
  status: z.enum(ACTIVE_INCIDENT_STATUS_VALUES),
  resolution: z.null(),
})

const resolvedIncidentSchema = z.strictObject({
  ...incidentBaseShape,
  status: z.literal('resolved'),
  resolution: incidentResolutionSchema,
})

const incidentSchema = z.union([activeIncidentSchema, resolvedIncidentSchema])

export const demoDataSchema = z.strictObject({
  version: z.literal(DEMO_DATA_VERSION),
  seededAt: timestampSchema,
  people: z.array(personSchema),
  services: z.array(serviceSchema),
  incidents: z.array(incidentSchema),
})

export function parseDemoData(value: unknown): DemoData {
  const data: DemoData = demoDataSchema.parse(value)

  validateDemoData(data)

  return data
}
