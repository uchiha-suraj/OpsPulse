import { useParams } from 'react-router'

export function IncidentDetailsPage() {
  const { incidentId } = useParams<{ incidentId: string }>()

  if (!incidentId) {
    throw new Error('Incident details route requires an incident ID')
  }

  return (
    <main>
      <h1>Incident {incidentId}</h1>
      <p>Incident details and activity will appear here.</p>
    </main>
  )
}
