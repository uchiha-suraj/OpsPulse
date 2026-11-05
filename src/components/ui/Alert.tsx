import type { ComponentPropsWithoutRef, ReactNode } from 'react'

import { cva, type VariantProps } from 'class-variance-authority'
import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react'

import { cn } from '@/lib/utils/cn'

const alertVariants = cva(
  ['flex items-start gap-2 rounded-card border px-3 py-2', 'text-body'],
  {
    variants: {
      tone: {
        info: 'border-info/30 bg-info-subtle text-info',
        success: 'border-success/30 bg-success-subtle text-success',
        warning: 'border-warning/30 bg-warning-subtle text-warning',
        critical: 'border-critical/30 bg-critical-subtle text-critical',
      },
    },
    defaultVariants: {
      tone: 'info',
    },
  },
)

type AlertProps = Omit<ComponentPropsWithoutRef<'div'>, 'title'> &
  VariantProps<typeof alertVariants> & {
    children: ReactNode
    icon?: ReactNode
    showIcon?: boolean
    title?: ReactNode
  }

export function Alert({
  children,
  className,
  icon,
  showIcon = true,
  title,
  tone,
  ...props
}: AlertProps) {
  const resolvedTone = tone ?? 'info'

  const defaultIcon = {
    critical: <CircleAlert />,
    info: <Info />,
    success: <CircleCheck />,
    warning: <TriangleAlert />,
  }[resolvedTone]

  return (
    <div
      className={cn(alertVariants({ tone: resolvedTone }), className)}
      {...props}
    >
      {showIcon && (
        <span
          aria-hidden="true"
          className="mt-px inline-flex shrink-0 [&>svg]:size-4"
        >
          {icon ?? defaultIcon}
        </span>
      )}

      <div className="min-w-0">
        {title !== undefined && <p className="font-medium">{title}</p>}

        <div
          className={cn(
            title !== undefined && 'mt-0.5',
            'text-foreground-secondary',
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
