import type { ComponentPropsWithoutRef } from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils/cn'

const avatarVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center',
    'rounded-round border border-border-strong',
    'bg-accent-subtle font-medium text-accent',
  ],
  {
    variants: {
      size: {
        small: 'size-6 text-[10px] leading-none',
        medium: 'size-8 text-label leading-none',
      },
    },
    defaultVariants: {
      size: 'medium',
    },
  },
)

function getInitials(name: string): string {
  const nameParts = name
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 0)

  if (nameParts.length === 0) {
    return '?'
  }

  return nameParts
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
}

type AvatarProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> &
  VariantProps<typeof avatarVariants> & {
    initials?: string
    name: string
  }

export function Avatar({
  'aria-hidden': ariaHidden,
  className,
  initials,
  name,
  size,
  ...props
}: AvatarProps) {
  const displayInitials = initials ?? getInitials(name)
  const isDecorative = ariaHidden === true

  return (
    <span
      role={isDecorative ? undefined : 'img'}
      aria-label={isDecorative ? undefined : name}
      aria-hidden={ariaHidden}
      className={cn(avatarVariants({ size }), className)}
      {...props}
    >
      {displayInitials}
    </span>
  )
}
