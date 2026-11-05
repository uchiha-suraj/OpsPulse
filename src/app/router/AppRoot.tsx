import { Outlet } from 'react-router'

import { AppShell } from '@/components/layout/AppShell'

export function AppRoot() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}
