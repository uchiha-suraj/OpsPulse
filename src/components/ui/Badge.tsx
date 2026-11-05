import type { ComponentPropsWithoutRef } from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils/cn'

const badgeVariants = cva(
  [
    'inline-flex items-center justify-center gap-1 whitespace-nowrap',
    'rounded-badge border px-1.5 font-medium',
  ],
  {
    variants: {
      tone: {
        neutral: 'border-border bg-surface-raised text-foreground-secondary',
        accent: 'border-accent/30 bg-accent-subtle text-accent',
        success: 'border-success/30 bg-success-subtle text-success',
        warning: 'border-warning/30 bg-warning-subtle text-warning',
        critical: 'border-critical/30 bg-critical-subtle text-critical',
        info: 'border-info/30 bg-info-subtle text-info',
      },
      size: {
        small: 'h-[18px] text-label-xs',
        medium: 'h-5 text-label',
      },
    },
    defaultVariants: {
      size: 'medium',
      tone: 'neutral',
    },
  },
)

type BadgeProps = ComponentPropsWithoutRef<'span'> &
  VariantProps<typeof badgeVariants>

export function Badge({ className, size, tone, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ size, tone }), className)} {...props} />
  )
}
