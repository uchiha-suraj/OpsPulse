import { matchPath } from 'react-router'

import { APP_PATHS } from '@/app/router/paths'

export interface RouteBreadcrumb {
  readonly label: string
  readonly path?: string
}

export interface RouteContext {
  readonly breadcrumbs: readonly RouteBreadcrumb[]
  readonly mobileTitle: string
  readonly showMobileBack: boolean
}

export function getRouteContext(pathname: string): RouteContext {
  if (
    matchPath(
      {
        path: APP_PATHS.dashboard,
        end: true,
      },
      pathname,
    )
  ) {
    return {
      breadcrumbs: [{ label: 'Dashboard' }],
      mobileTitle: 'Dashboard',
      showMobileBack: false,
    }
  }

  if (
    matchPath(
      {
        path: APP_PATHS.createIncident,
        end: true,
      },
      pathname,
    )
  ) {
    return {
      breadcrumbs: [
        {
          label: 'Incidents',
          path: APP_PATHS.incidents,
        },
        {
          label: 'Create incident',
        },
      ],
      mobileTitle: 'Create incident',
      showMobileBack: true,
    }
  }

  if (
    matchPath(
      {
        path: APP_PATHS.incidents,
        end: true,
      },
      pathname,
    )
  ) {
    return {
      breadcrumbs: [{ label: 'Incidents' }],
      mobileTitle: 'Incidents',
      showMobileBack: false,
    }
  }

  const incidentDetailsMatch = matchPath(
    {
      path: APP_PATHS.incidentDetails,
      end: true,
    },
    pathname,
  )

  if (incidentDetailsMatch !== null) {
    const incidentId = incidentDetailsMatch.params.incidentId ?? 'Incident'

    return {
      breadcrumbs: [
        {
          label: 'Incidents',
          path: APP_PATHS.incidents,
        },
        {
          label: incidentId,
        },
      ],
      mobileTitle: incidentId,
      showMobileBack: true,
    }
  }

  return {
    breadcrumbs: [{ label: 'OpsPulse' }],
    mobileTitle: 'OpsPulse',
    showMobileBack: false,
  }
}
