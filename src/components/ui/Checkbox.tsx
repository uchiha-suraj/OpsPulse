import {
  forwardRef,
  useId,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'

import { cn } from '@/lib/utils/cn'

type CheckboxProps = ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & {
  containerClassName?: string
  description?: string
  label: ReactNode
}

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      'aria-describedby': ariaDescribedBy,
      className,
      containerClassName,
      description,
      disabled,
      id,
      label,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId()
    const checkboxId = id ?? generatedId

    const hasDescription = description !== undefined && description.length > 0
    const descriptionId = hasDescription
      ? `${checkboxId}-description`
      : undefined

    const describedByValues = [ariaDescribedBy, descriptionId].filter(
      (value): value is string => value !== undefined && value.length > 0,
    )

    const describedBy =
      describedByValues.length > 0 ? describedByValues.join(' ') : undefined

    return (
      <div
        className={cn(
          'flex items-start gap-2',
          disabled && 'opacity-45',
          containerClassName,
        )}
      >
        <CheckboxPrimitive.Root
          ref={ref}
          id={checkboxId}
          disabled={disabled}
          aria-describedby={describedBy}
          className={cn(
            [
              'group mt-px flex size-4 shrink-0 items-center justify-center',
              'rounded-badge border border-border-strong bg-surface',
              'text-foreground-on-accent transition-colors',
              'hover:border-focus-ring',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
              'data-[state=checked]:border-accent data-[state=checked]:bg-accent',
              'data-[state=indeterminate]:border-accent data-[state=indeterminate]:bg-accent',
              'disabled:cursor-not-allowed',
            ],
            className,
          )}
          {...props}
        >
          <CheckboxPrimitive.Indicator className="flex items-center justify-center">
            <Check
              aria-hidden="true"
              className="size-3 group-data-[state=indeterminate]:hidden"
            />
            <Minus
              aria-hidden="true"
              className="hidden size-3 group-data-[state=indeterminate]:block"
            />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>

        <div className="flex min-w-0 flex-col gap-1">
          <label
            htmlFor={checkboxId}
            className="cursor-pointer text-body text-foreground"
          >
            {label}
          </label>

          {hasDescription && (
            <p id={descriptionId} className="text-label text-foreground-muted">
              {description}
            </p>
          )}
        </div>
      </div>
    )
  },
)

Checkbox.displayName = 'Checkbox'
