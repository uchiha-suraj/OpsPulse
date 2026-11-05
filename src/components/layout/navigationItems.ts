import { LayoutDashboard, Siren, type LucideIcon } from 'lucide-react'

import { APP_PATHS } from '@/app/router/paths'

export interface NavigationItem {
  readonly icon: LucideIcon
  readonly label: string
  readonly path: string
}

export const NAVIGATION_ITEMS = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    path: APP_PATHS.dashboard,
  },
  {
    icon: Siren,
    label: 'Incidents',
    path: APP_PATHS.incidents,
  },
] as const satisfies readonly NavigationItem[]
