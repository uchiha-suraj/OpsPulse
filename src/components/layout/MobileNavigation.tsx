import type { ReactElement } from 'react'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Activity, X } from 'lucide-react'
import { Link, NavLink } from 'react-router'

import { APP_PATHS } from '@/app/router/paths'
import { NAVIGATION_ITEMS } from '@/components/layout/navigationItems'
import { IconButton } from '@/components/ui/IconButton'
import { cn } from '@/lib/utils/cn'

interface MobileNavigationProps {
  onOpenChange: (open: boolean) => void
  open: boolean
  trigger: ReactElement
}

export function MobileNavigation({
  onOpenChange,
  open,
  trigger,
}: MobileNavigationProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 lg:hidden" />

        <DialogPrimitive.Content
          className={cn([
            'fixed inset-y-0 left-0 z-50 flex w-[280px]',
            'max-w-[80vw] flex-col',
            'border-r border-border bg-sidebar shadow-2xl',
            'focus:outline-none lg:hidden',
          ])}
        >
          <DialogPrimitive.Title className="sr-only">
            Main navigation
          </DialogPrimitive.Title>

          <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-border px-3">
            <Link
              to={APP_PATHS.dashboard}
              onClick={() => {
                onOpenChange(false)
              }}
              className="flex items-center gap-2 rounded-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            >
              <span className="inline-flex size-7 items-center justify-center rounded-control bg-accent text-foreground-on-accent">
                <Activity aria-hidden="true" className="size-4" />
              </span>

              <span className="text-heading-sm font-semibold">OpsPulse</span>
            </Link>

            <DialogPrimitive.Close asChild>
              <IconButton label="Close navigation" icon={<X />} />
            </DialogPrimitive.Close>
          </div>

          <nav
            aria-label="Mobile navigation"
            className="flex flex-1 flex-col gap-1 px-3 py-4"
          >
            {NAVIGATION_ITEMS.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === APP_PATHS.dashboard}
                  onClick={() => {
                    onOpenChange(false)
                  }}
                  className={({ isActive }) =>
                    cn(
                      [
                        'flex h-10 items-center gap-3 rounded-control px-3',
                        'text-body-lg font-medium transition-colors',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
                      ],
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
                          'size-5 shrink-0',
                          isActive ? 'text-accent' : 'text-foreground-muted',
                        )}
                      />
                      {item.label}
                    </>
                  )}
                </NavLink>
              )
            })}
          </nav>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
