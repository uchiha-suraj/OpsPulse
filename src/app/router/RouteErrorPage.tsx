import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import { APP_PATHS } from './paths'

export function RouteErrorPage() {
  const error = useRouteError()

  const title = isRouteErrorResponse(error)
    ? `${String(error.status)} ${error.statusText || 'Request failed'}`
    : 'Something went wrong'

  return (
    <main role="alert">
      <h1>{title}</h1>
      <p>The requested page could not be displayed.</p>
      <Link to={APP_PATHS.dashboard}>Return to dashboard</Link>
    </main>
  )
}
