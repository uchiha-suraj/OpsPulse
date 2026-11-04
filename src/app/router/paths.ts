export const APP_PATHS = {
  root: '/',
  dashboard: '/dashboard',
  incidents: '/incidents',
  createIncident: '/incidents/new',
  incidentDetails: '/incidents/:incidentId',
} as const

export function getIncidentDetailsPath(incidentId: string): string {
  return `/incidents/${encodeURIComponent(incidentId)}`
}
