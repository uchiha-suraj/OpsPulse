import { forwardRef, type ComponentPropsWithoutRef } from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils/cn'

const buttonVariants = cva(
  [
    'inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap',
    'rounded-control px-3.5 text-body font-medium',
    'transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
    'disabled:pointer-events-none disabled:opacity-45',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-accent text-foreground-on-accent hover:bg-accent-hover',
        secondary:
          'border border-border bg-surface text-foreground hover:border-border-strong hover:bg-surface-raised',
        ghost: 'bg-transparent text-foreground hover:bg-surface-raised',
        destructive:
          'bg-critical text-foreground-on-accent hover:bg-critical/90',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
)

type ButtonProps = ComponentPropsWithoutRef<'button'> &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean
    loadingText?: string
  }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      disabled,
      isLoading = false,
      loadingText,
      type = 'button',
      variant,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant }), className)}
      disabled={isLoading ? true : disabled}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading && (
        <span
          aria-hidden="true"
          className="size-3.5 animate-spin rounded-round border-2 border-current border-r-transparent"
        />
      )}

      {isLoading && loadingText ? loadingText : children}
    </button>
  ),
)

Button.displayName = 'Button'
