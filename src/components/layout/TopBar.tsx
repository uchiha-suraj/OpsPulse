import { ArrowLeft, ChevronRight, Menu } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router'

import { APP_PATHS } from '@/app/router/paths'
import { MobileNavigation } from '@/components/layout/MobileNavigation'
import { getRouteContext } from '@/components/layout/routeContext'
import { UserMenu } from '@/components/layout/UserMenu'
import { IconButton } from '@/components/ui/IconButton'

interface TopBarProps {
  isMobileNavigationOpen: boolean
  onMobileNavigationOpenChange: (open: boolean) => void
}

export function TopBar({
  isMobileNavigationOpen,
  onMobileNavigationOpenChange,
}: TopBarProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const routeContext = getRouteContext(location.pathname)

  return (
    <header
      className={[
        'sticky top-0 z-30 flex h-[52px] items-center',
        'border-b border-border bg-canvas/95 px-3',
        'backdrop-blur lg:h-14 lg:px-6',
      ].join(' ')}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2 lg:hidden">
        {routeContext.showMobileBack ? (
          <IconButton
            label="Back to incidents"
            icon={<ArrowLeft />}
            onClick={() => {
              void navigate(APP_PATHS.incidents)
            }}
          />
        ) : (
          <MobileNavigation
            open={isMobileNavigationOpen}
            onOpenChange={onMobileNavigationOpenChange}
            trigger={<IconButton label="Open navigation" icon={<Menu />} />}
          />
        )}

        <h1 className="truncate text-body-lg font-semibold">
          {routeContext.mobileTitle}
        </h1>
      </div>

      <nav aria-label="Breadcrumb" className="hidden min-w-0 flex-1 lg:block">
        <ol className="flex items-center gap-1.5 text-label text-foreground-muted">
          {routeContext.breadcrumbs.map((breadcrumb, index) => {
            const isLast = index === routeContext.breadcrumbs.length - 1

            return (
              <li
                key={breadcrumb.path ?? breadcrumb.label}
                className="flex min-w-0 items-center gap-1.5"
              >
                {breadcrumb.path !== undefined ? (
                  <Link
                    to={breadcrumb.path}
                    className="truncate rounded-badge hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                  >
                    {breadcrumb.label}
                  </Link>
                ) : (
                  <span
                    aria-current={isLast ? 'page' : undefined}
                    className="truncate text-foreground"
                  >
                    {breadcrumb.label}
                  </span>
                )}

                {!isLast && (
                  <ChevronRight
                    aria-hidden="true"
                    className="size-3.5 shrink-0"
                  />
                )}
              </li>
            )
          })}
        </ol>
      </nav>

      <UserMenu compact align="end" side="bottom" tooltipSide="bottom" />
    </header>
  )
}
