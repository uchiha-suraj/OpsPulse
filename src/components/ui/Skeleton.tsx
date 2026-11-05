import type { ComponentPropsWithoutRef } from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils/cn'

const skeletonVariants = cva(
  ['animate-pulse bg-surface-raised', 'motion-reduce:animate-none'],
  {
    variants: {
      shape: {
        text: 'h-3 w-[200px] rounded-badge',
        title: 'h-5 w-[140px] rounded-control',
        block: 'h-[80px] w-[260px] rounded-card',
        circle: 'size-8 rounded-round',
      },
    },
    defaultVariants: {
      shape: 'text',
    },
  },
)

type SkeletonProps = Omit<ComponentPropsWithoutRef<'div'>, 'aria-hidden'> &
  VariantProps<typeof skeletonVariants>

export function Skeleton({ className, shape, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(skeletonVariants({ shape }), className)}
      {...props}
    />
  )
}
