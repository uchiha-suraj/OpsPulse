import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'

import { cn } from '@/lib/utils/cn'

type TooltipContentProps = ComponentPropsWithoutRef<
  typeof TooltipPrimitive.Content
>

type TooltipProps = Omit<
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>,
  'children'
> & {
  align?: TooltipContentProps['align']
  children: ReactElement
  content: ReactNode
  contentClassName?: string
  side?: TooltipContentProps['side']
  sideOffset?: number
}

export function Tooltip({
  align = 'center',
  children,
  content,
  contentClassName,
  side = 'top',
  sideOffset = 6,
  ...props
}: TooltipProps) {
  return (
    <TooltipPrimitive.Root {...props}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>

      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          align={align}
          side={side}
          sideOffset={sideOffset}
          className={cn(
            [
              'z-50 max-w-64 rounded-control border border-border',
              'bg-surface-raised px-2 py-1',
              'text-label text-foreground shadow-lg',
            ],
            contentClassName,
          )}
        >
          {content}

          <TooltipPrimitive.Arrow className="fill-surface-raised" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}
