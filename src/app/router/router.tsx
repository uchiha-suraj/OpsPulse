import { createBrowserRouter, Navigate } from 'react-router'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { CreateIncidentPage } from '@/features/incidents/pages/CreateIncidentPage'
import { IncidentDetailsPage } from '@/features/incidents/pages/IncidentDetailsPage'
import { IncidentListPage } from '@/features/incidents/pages/IncidentListPage'
import { AppRoot } from './AppRoot'
import { NotFoundPage } from './NotFoundPage'
import { APP_PATHS } from './paths'
import { RouteErrorPage } from './RouteErrorPage'

export const router = createBrowserRouter([
  {
    path: APP_PATHS.root,
    Component: AppRoot,
    errorElement: <RouteErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to={APP_PATHS.dashboard} replace />,
      },
      {
        path: APP_PATHS.dashboard,
        Component: DashboardPage,
      },
      {
        path: APP_PATHS.incidents,
        Component: IncidentListPage,
      },
      {
        path: APP_PATHS.createIncident,
        Component: CreateIncidentPage,
      },
      {
        path: APP_PATHS.incidentDetails,
        Component: IncidentDetailsPage,
      },
      {
        path: '*',
        Component: NotFoundPage,
      },
    ],
  },
])
