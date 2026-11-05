import { Activity, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Link, NavLink } from 'react-router'

import { APP_PATHS } from '@/app/router/paths'
import { useLayoutStore } from '@/app/stores/layoutStore'
import {
  NAVIGATION_ITEMS,
  type NavigationItem,
} from '@/components/layout/navigationItems'
import { UserMenu } from '@/components/layout/UserMenu'
import { IconButton } from '@/components/ui/IconButton'
import { Tooltip } from '@/components/ui/Tooltip'
import { cn } from '@/lib/utils/cn'

interface SidebarNavigationItemProps {
  isCollapsed: boolean
  item: NavigationItem
}

function SidebarNavigationItem({
  isCollapsed,
  item,
}: SidebarNavigationItemProps) {
  const Icon = item.icon

  const navigationLink = (
    <NavLink
      to={item.path}
      end={item.path === APP_PATHS.dashboard}
      aria-label={isCollapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          [
            'flex h-9 items-center rounded-control',
            'text-body font-medium transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
          ],
          isCollapsed ? 'justify-center px-0' : 'gap-3 px-3',
          isActive
            ? 'bg-accent-subtle text-foreground'
            : 'text-foreground-secondary hover:bg-surface-raised hover:text-foreground',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            aria-hidden="true"
            className={cn(
              'size-4 shrink-0',
              isActive ? 'text-accent' : 'text-foreground-muted',
            )}
          />

          {!isCollapsed && <span className="truncate">{item.label}</span>}
        </>
      )}
    </NavLink>
  )

  return isCollapsed ? (
    <Tooltip content={item.label} side="right">
      {navigationLink}
    </Tooltip>
  ) : (
    navigationLink
  )
}

export function Sidebar() {
  const isCollapsed = useLayoutStore((state) => state.isSidebarCollapsed)
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar)

  return (
    <aside
      aria-label="Primary navigation"
      className={cn(
        [
          'fixed inset-y-0 left-0 z-40 hidden flex-col',
          'border-r border-border bg-sidebar',
          'transition-[width] duration-200',
          'motion-reduce:transition-none',
          'lg:flex',
        ],
        isCollapsed ? 'w-16' : 'w-[232px]',
      )}
    >
      <div
        className={cn(
          'flex h-14 shrink-0 items-center border-b border-border',
          isCollapsed ? 'justify-center px-2' : 'justify-between px-3',
        )}
      >
        <Tooltip content="Go to dashboard" side="right" disabled={!isCollapsed}>
          <Link
            to={APP_PATHS.dashboard}
            aria-label={isCollapsed ? 'OpsPulse dashboard' : undefined}
            className={cn(
              [
                'flex items-center rounded-control',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
              ],
              isCollapsed ? 'justify-center' : 'gap-2',
            )}
          >
            <span className="inline-flex size-7 items-center justify-center rounded-control bg-accent text-foreground-on-accent">
              <Activity aria-hidden="true" className="size-4" />
            </span>

            {!isCollapsed && (
              <span className="text-heading-sm font-semibold">OpsPulse</span>
            )}
          </Link>
        </Tooltip>

        {!isCollapsed && (
          <Tooltip content="Collapse sidebar">
            <IconButton
              label="Collapse sidebar"
              icon={<PanelLeftClose />}
              onClick={toggleSidebar}
            />
          </Tooltip>
        )}
      </div>

      {isCollapsed && (
        <div className="flex justify-center border-b border-border py-2">
          <Tooltip content="Expand sidebar" side="right">
            <IconButton
              label="Expand sidebar"
              icon={<PanelLeftOpen />}
              onClick={toggleSidebar}
            />
          </Tooltip>
        </div>
      )}

      <nav
        aria-label="Main navigation"
        className="flex flex-1 flex-col gap-1 px-2 py-4"
      >
        {NAVIGATION_ITEMS.map((item) => (
          <SidebarNavigationItem
            key={item.path}
            item={item}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>

      <div className="border-t border-border p-2">
        <UserMenu
          compact={isCollapsed}
          align={isCollapsed ? 'start' : 'end'}
          side="right"
        />
      </div>
    </aside>
  )
}
