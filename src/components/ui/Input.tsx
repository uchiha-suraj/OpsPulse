import { forwardRef, useId, type ComponentPropsWithoutRef } from 'react'

import { TriangleAlert } from 'lucide-react'

import { cn } from '@/lib/utils/cn'

type InputProps = Omit<ComponentPropsWithoutRef<'input'>, 'size'> & {
  containerClassName?: string
  description?: string
  error?: string
  label: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      className,
      containerClassName,
      description,
      disabled,
      error,
      id,
      label,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId()
    const inputId = id ?? generatedId

    const hasDescription = description !== undefined && description.length > 0
    const hasError = error !== undefined && error.length > 0

    const descriptionId = hasDescription ? `${inputId}-description` : undefined
    const errorId = hasError ? `${inputId}-error` : undefined

    const describedByValues = [ariaDescribedBy, descriptionId, errorId].filter(
      (value): value is string => value !== undefined && value.length > 0,
    )

    const describedBy =
      describedByValues.length > 0 ? describedByValues.join(' ') : undefined

    return (
      <div
        className={cn(
          'flex w-full flex-col gap-1.5',
          disabled && 'opacity-45',
          containerClassName,
        )}
      >
        <label
          htmlFor={inputId}
          className="text-label font-medium text-foreground-secondary"
        >
          {label}
        </label>

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-describedby={describedBy}
          aria-invalid={hasError ? true : ariaInvalid}
          className={cn(
            [
              'h-9 w-full rounded-control border border-border bg-surface px-3',
              'text-body text-foreground outline-none',
              'placeholder:text-foreground-muted',
              'transition-colors',
              'focus-visible:border-focus-ring focus-visible:ring-1 focus-visible:ring-focus-ring',
              'aria-invalid:border-critical aria-invalid:focus-visible:ring-critical',
              'disabled:cursor-not-allowed',
            ],
            className,
          )}
          {...props}
        />

        {hasDescription && (
          <p id={descriptionId} className="text-label text-foreground-muted">
            {description}
          </p>
        )}

        {hasError && (
          <p
            id={errorId}
            role="alert"
            className="flex items-center gap-1 text-label text-critical"
          >
            <TriangleAlert aria-hidden="true" className="size-3 shrink-0" />
            {error}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
