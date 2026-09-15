import {
  INCIDENT_SEVERITY_VALUES,
  type Incident,
  type IncidentSeverity,
} from '@/types/incident'
import { createIncidentFromSeed } from './createIncidentFromSeed'
import { INCIDENT_SEED_DEFINITIONS } from './incidentSeedDefinitions'

const EXPECTED_INCIDENT_COUNT = 32
const EXPECTED_ACTIVE_INCIDENT_COUNT = 4
const EXPECTED_RESOLVED_INCIDENT_COUNT = 28

const EXPECTED_ACTIVE_SEVERITY_COUNTS = {
  sev1: 1,
  sev2: 2,
  sev3: 1,
  sev4: 0,
} as const satisfies Record<IncidentSeverity, number>

function assertUniqueIncidentIds(incidents: readonly Incident[]): void {
  const incidentIds = new Set(incidents.map((incident) => incident.id))

  if (incidentIds.size !== incidents.length) {
    throw new Error('Incident seed contains duplicate incident IDs')
  }
}

function assertExpectedIncidentCounts(incidents: readonly Incident[]): void {
  const activeIncidents = incidents.filter(
    (incident) => incident.status !== 'resolved',
  )
  const resolvedIncidentCount = incidents.length - activeIncidents.length

  if (incidents.length !== EXPECTED_INCIDENT_COUNT) {
    throw new RangeError(
      `Expected ${String(EXPECTED_INCIDENT_COUNT)} incidents but received ${String(incidents.length)}`,
    )
  }

  if (activeIncidents.length !== EXPECTED_ACTIVE_INCIDENT_COUNT) {
    throw new RangeError(
      `Expected ${String(EXPECTED_ACTIVE_INCIDENT_COUNT)} active incidents but received ${String(activeIncidents.length)}`,
    )
  }

  if (resolvedIncidentCount !== EXPECTED_RESOLVED_INCIDENT_COUNT) {
    throw new RangeError(
      `Expected ${String(EXPECTED_RESOLVED_INCIDENT_COUNT)} resolved incidents but received ${String(resolvedIncidentCount)}`,
    )
  }

  const activeSeverityCounts: Record<IncidentSeverity, number> = {
    sev1: 0,
    sev2: 0,
    sev3: 0,
    sev4: 0,
  }

  for (const incident of activeIncidents) {
    activeSeverityCounts[incident.severity] += 1
  }

  for (const severity of INCIDENT_SEVERITY_VALUES) {
    const expectedCount = EXPECTED_ACTIVE_SEVERITY_COUNTS[severity]
    const actualCount = activeSeverityCounts[severity]

    if (actualCount !== expectedCount) {
      throw new RangeError(
        `Expected ${String(expectedCount)} active ${severity} incidents but received ${String(actualCount)}`,
      )
    }
  }
}

export function createIncidentsSeed(anchorTime: Date): readonly Incident[] {
  const incidents = INCIDENT_SEED_DEFINITIONS.map((definition) =>
    createIncidentFromSeed(definition, anchorTime),
  )

  assertUniqueIncidentIds(incidents)
  assertExpectedIncidentCounts(incidents)

  return incidents
}
