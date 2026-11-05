import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cn } from '@/lib/utils/cn'

type EmptyStateProps = Omit<ComponentPropsWithoutRef<'div'>, 'title'> & {
  action?: ReactNode
  description: ReactNode
  icon?: ReactNode
  title: ReactNode
}

export function EmptyState({
  action,
  className,
  description,
  icon,
  title,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        [
          'flex w-full max-w-sm flex-col items-center',
          'px-6 py-10 text-center',
        ],
        className,
      )}
      {...props}
    >
      {icon !== undefined && (
        <span
          aria-hidden="true"
          className={cn([
            'mb-4 inline-flex size-10 items-center justify-center',
            'rounded-round bg-surface-raised text-foreground-secondary',
            '[&>svg]:size-5',
          ])}
        >
          {icon}
        </span>
      )}

      <h2 className="text-heading-sm font-semibold text-foreground">{title}</h2>

      <div className="mt-1.5 text-body-lg text-foreground-secondary">
        {description}
      </div>

      {action !== undefined && <div className="mt-5">{action}</div>}
    </div>
  )
}
