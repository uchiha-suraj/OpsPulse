import { Link } from 'react-router'
import { APP_PATHS } from './paths'

export function NotFoundPage() {
  return (
    <main>
      <h1>Page not found</h1>
      <p>The page you requested does not exist.</p>
      <Link to={APP_PATHS.dashboard}>Return to dashboard</Link>
    </main>
  )
}
