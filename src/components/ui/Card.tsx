import type { ComponentPropsWithoutRef } from 'react'

import { cn } from '@/lib/utils/cn'

type CardProps = ComponentPropsWithoutRef<'div'>

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn('rounded-card border border-border bg-surface', className)}
      {...props}
    />
  )
}
