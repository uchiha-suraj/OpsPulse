import {
  forwardRef,
  useId,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react'

import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp, TriangleAlert } from 'lucide-react'

import { cn } from '@/lib/utils/cn'

interface SelectOption {
  disabled?: boolean
  label: ReactNode
  value: string
}

type SelectProps = Omit<
  ComponentPropsWithoutRef<typeof SelectPrimitive.Root>,
  'children'
> & {
  'aria-describedby'?: string
  className?: string
  containerClassName?: string
  description?: string
  error?: string
  id?: string
  label: ReactNode
  options: readonly SelectOption[]
  placeholder?: string
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      'aria-describedby': ariaDescribedBy,
      className,
      containerClassName,
      description,
      disabled,
      error,
      id,
      label,
      options,
      placeholder = 'Select an option',
      ...props
    },
    ref,
  ) => {
    const generatedId = useId()
    const selectId = id ?? generatedId

    const hasDescription = description !== undefined && description.length > 0
    const hasError = error !== undefined && error.length > 0

    const descriptionId = hasDescription ? `${selectId}-description` : undefined
    const errorId = hasError ? `${selectId}-error` : undefined

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
          htmlFor={selectId}
          className="text-label font-medium text-foreground-secondary"
        >
          {label}
        </label>

        <SelectPrimitive.Root disabled={disabled} {...props}>
          <SelectPrimitive.Trigger
            ref={ref}
            id={selectId}
            aria-describedby={describedBy}
            aria-invalid={hasError}
            className={cn(
              [
                'flex h-9 w-full items-center justify-between gap-2',
                'rounded-control border border-border bg-surface px-3',
                'text-body text-foreground outline-none',
                'transition-colors',
                'hover:border-border-strong',
                'focus-visible:border-focus-ring focus-visible:ring-1 focus-visible:ring-focus-ring',
                'data-[placeholder]:text-foreground-muted',
                'data-[state=open]:border-focus-ring data-[state=open]:ring-1 data-[state=open]:ring-focus-ring',
                'aria-invalid:border-critical aria-invalid:ring-critical',
                'disabled:cursor-not-allowed',
              ],
              className,
            )}
          >
            <SelectPrimitive.Value placeholder={placeholder} />

            <SelectPrimitive.Icon asChild>
              <ChevronDown
                aria-hidden="true"
                className="size-4 shrink-0 text-foreground-muted"
              />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>

          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              position="popper"
              sideOffset={4}
              className={cn([
                'z-50 max-h-72 overflow-hidden',
                'min-w-[var(--radix-select-trigger-width)]',
                'rounded-control border border-border bg-surface-raised',
                'text-foreground shadow-lg',
              ])}
            >
              <SelectPrimitive.ScrollUpButton className="flex h-7 items-center justify-center">
                <ChevronUp aria-hidden="true" className="size-4" />
              </SelectPrimitive.ScrollUpButton>

              <SelectPrimitive.Viewport className="p-1">
                {options.map((option) => (
                  <SelectPrimitive.Item
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    className={cn([
                      'relative flex min-h-8 cursor-default select-none items-center',
                      'rounded-badge py-1.5 pr-2 pl-8 text-body outline-none',
                      'data-[highlighted]:bg-accent-subtle',
                      'data-[highlighted]:text-foreground',
                      'data-[disabled]:pointer-events-none data-[disabled]:opacity-45',
                    ])}
                  >
                    <SelectPrimitive.ItemIndicator className="absolute left-2 inline-flex items-center">
                      <Check
                        aria-hidden="true"
                        className="size-4 text-accent"
                      />
                    </SelectPrimitive.ItemIndicator>

                    <SelectPrimitive.ItemText>
                      {option.label}
                    </SelectPrimitive.ItemText>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.Viewport>

              <SelectPrimitive.ScrollDownButton className="flex h-7 items-center justify-center">
                <ChevronDown aria-hidden="true" className="size-4" />
              </SelectPrimitive.ScrollDownButton>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>

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

Select.displayName = 'Select'
