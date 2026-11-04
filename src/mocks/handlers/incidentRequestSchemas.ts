import * as z from 'zod'
import {
  ACTIVE_INCIDENT_STATUS_VALUES,
  INCIDENT_SEVERITY_VALUES,
} from '@/types/incident'

const identifierSchema = z.string().trim().min(1)
const requiredTextSchema = z.string().trim().min(1)
const nullableTextSchema = requiredTextSchema.nullable()

const teamShape = {
  commanderId: identifierSchema,
  responderIds: z.array(identifierSchema),
}

const editableIncidentShape = {
  title: requiredTextSchema,
  description: nullableTextSchema,
  severity: z.enum(INCIDENT_SEVERITY_VALUES),
  affectedServiceIds: z.array(identifierSchema).min(1),
  region: nullableTextSchema,
  ...teamShape,
}

export const createIncidentRequestSchema = z.strictObject({
  ...editableIncidentShape,
  description: nullableTextSchema.optional(),
  region: nullableTextSchema.optional(),
  responderIds: z.array(identifierSchema).optional(),
  startedAt: z.iso.datetime().optional(),
})

export const editIncidentRequestSchema = z
  .strictObject({
    title: requiredTextSchema.optional(),
    description: nullableTextSchema.optional(),
    severity: z.enum(INCIDENT_SEVERITY_VALUES).optional(),
    affectedServiceIds: z.array(identifierSchema).min(1).optional(),
    region: nullableTextSchema.optional(),
    commanderId: identifierSchema.optional(),
    responderIds: z.array(identifierSchema).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'Provide at least one incident field to update.',
  })

export const changeIncidentStatusRequestSchema = z.strictObject({
  status: z.enum(ACTIVE_INCIDENT_STATUS_VALUES),
})

export const addTimelineUpdateRequestSchema = z.strictObject({
  message: requiredTextSchema,
})

export const addInternalNoteRequestSchema = z.strictObject({
  content: requiredTextSchema,
})

export const resolveIncidentRequestSchema = z.strictObject({
  summary: requiredTextSchema,
  rootCause: nullableTextSchema.optional(),
  resolvedAt: z.iso.datetime().optional(),
})
