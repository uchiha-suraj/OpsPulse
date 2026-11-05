import { useState, type ComponentPropsWithoutRef } from 'react'

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { ChevronUp, Moon, RotateCcw, Sun } from 'lucide-react'

import { useThemeStore } from '@/app/stores/themeStore'
import { ResetDemoDataDialog } from '@/components/layout/ResetDemoDataDialog'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { Tooltip } from '@/components/ui/Tooltip'
import { DEMO_USER } from '@/lib/config/demoUser'
import { cn } from '@/lib/utils/cn'
import { PERSON_AVAILABILITY_LABELS } from '@/types/person'

type MenuContentProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Content
>

interface UserMenuProps {
  align?: MenuContentProps['align']
  compact?: boolean
  side?: MenuContentProps['side']
  tooltipSide?: ComponentPropsWithoutRef<typeof Tooltip>['side']
}

const menuItemClassName = cn([
  'flex min-h-8 cursor-default select-none items-center gap-2',
  'rounded-control px-2 text-body text-foreground outline-none',
  'data-[highlighted]:bg-surface-raised',
])

export function UserMenu({
  align = 'start',
  compact = false,
  side = 'right',
  tooltipSide = 'right',
}: UserMenuProps) {
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)

  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)

  const shortRole = DEMO_USER.role.split(' / ').at(0) ?? DEMO_USER.role

  const menuTrigger = compact ? (
    <IconButton
      label="Open user menu"
      icon={
        <Avatar
          aria-hidden="true"
          name={DEMO_USER.name}
          initials={DEMO_USER.initials}
        />
      }
      className="size-10"
    />
  ) : (
    <Button variant="ghost" className="h-auto w-full justify-start px-2 py-2">
      <Avatar
        aria-hidden="true"
        name={DEMO_USER.name}
        initials={DEMO_USER.initials}
      />

      <span className="min-w-0 flex-1 text-left">
        <span className="block truncate text-body font-medium">
          {DEMO_USER.name}
        </span>
        <span className="block truncate text-label text-foreground-muted">
          {PERSON_AVAILABILITY_LABELS[DEMO_USER.availability]} · {shortRole}
        </span>
      </span>

      <ChevronUp aria-hidden="true" className="size-4 text-foreground-muted" />
    </Button>
  )

  return (
    <>
      <DropdownMenuPrimitive.Root>
        {compact ? (
          <Tooltip content="Open user menu" side={tooltipSide}>
            <DropdownMenuPrimitive.Trigger asChild>
              {menuTrigger}
            </DropdownMenuPrimitive.Trigger>
          </Tooltip>
        ) : (
          <DropdownMenuPrimitive.Trigger asChild>
            {menuTrigger}
          </DropdownMenuPrimitive.Trigger>
        )}

        <DropdownMenuPrimitive.Portal>
          <DropdownMenuPrimitive.Content
            align={align}
            side={side}
            sideOffset={8}
            className={cn([
              'z-50 min-w-60 rounded-card',
              'border border-border bg-surface p-1 shadow-xl',
            ])}
          >
            <DropdownMenuPrimitive.Label className="px-2 py-2">
              <span className="block text-body font-medium text-foreground">
                {DEMO_USER.name}
              </span>
              <span className="block text-label text-foreground-muted">
                {DEMO_USER.role}
              </span>
              <span className="mt-1 flex items-center gap-1.5 text-label text-success">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-round bg-success"
                />
                {PERSON_AVAILABILITY_LABELS[DEMO_USER.availability]}
              </span>
            </DropdownMenuPrimitive.Label>

            <DropdownMenuPrimitive.Separator className="my-1 h-px bg-border" />

            <DropdownMenuPrimitive.Item
              className={menuItemClassName}
              onSelect={toggleTheme}
            >
              {theme === 'dark' ? (
                <Sun aria-hidden="true" className="size-4" />
              ) : (
                <Moon aria-hidden="true" className="size-4" />
              )}
              Switch to {theme === 'dark' ? 'light' : 'dark'} theme
            </DropdownMenuPrimitive.Item>

            <DropdownMenuPrimitive.Separator className="my-1 h-px bg-border" />

            <DropdownMenuPrimitive.Item
              className={cn(
                menuItemClassName,
                'text-critical data-[highlighted]:bg-critical-subtle',
              )}
              onSelect={() => {
                setIsResetDialogOpen(true)
              }}
            >
              <RotateCcw aria-hidden="true" className="size-4" />
              Reset Demo Data
            </DropdownMenuPrimitive.Item>
          </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Portal>
      </DropdownMenuPrimitive.Root>

      <ResetDemoDataDialog
        open={isResetDialogOpen}
        onOpenChange={setIsResetDialogOpen}
      />
    </>
  )
}
