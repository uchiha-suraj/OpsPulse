import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react'

import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

type IconButtonProps = Omit<
  ComponentPropsWithoutRef<typeof Button>,
  'aria-label' | 'children' | 'loadingText'
> & {
  icon: ReactNode
  label: string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { className, icon, isLoading = false, label, variant = 'ghost', ...props },
    ref,
  ) => (
    <Button
      ref={ref}
      variant={variant}
      className={cn('size-9 px-0', className)}
      isLoading={isLoading}
      aria-label={label}
      {...props}
    >
      {isLoading ? null : (
        <span aria-hidden="true" className="inline-flex [&>svg]:size-4">
          {icon}
        </span>
      )}
    </Button>
  ),
)

IconButton.displayName = 'IconButton'
