import { useState } from 'react'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { RotateCcw, X } from 'lucide-react'
import { useNavigate } from 'react-router'

import { resetDemoData } from '@/app/api/resetDemoData'
import { queryClient } from '@/app/providers/queryClient'
import { APP_PATHS } from '@/app/router/paths'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'

type ResetStatus = 'idle' | 'pending' | 'success' | 'error'

interface ResetDemoDataDialogProps {
  onOpenChange: (open: boolean) => void
  open: boolean
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'Unable to reset the demo data.'
}

export function ResetDemoDataDialog({
  onOpenChange,
  open,
}: ResetDemoDataDialogProps) {
  const navigate = useNavigate()

  const [status, setStatus] = useState<ResetStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const isPending = status === 'pending'

  function resetDialogState(): void {
    setStatus('idle')
    setErrorMessage(null)
  }

  function handleOpenChange(nextOpen: boolean): void {
    if (isPending) {
      return
    }

    if (!nextOpen) {
      resetDialogState()
    }

    onOpenChange(nextOpen)
  }

  async function handleReset(): Promise<void> {
    setStatus('pending')
    setErrorMessage(null)

    try {
      await resetDemoData()
      queryClient.clear()
      setStatus('success')
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error))
      setStatus('error')
    }
  }

  function handleFinish(): void {
    resetDialogState()
    onOpenChange(false)
    void navigate(APP_PATHS.dashboard)
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60" />

        <DialogPrimitive.Content
          className={[
            'fixed top-1/2 left-1/2 z-50',
            'w-[calc(100%-2rem)] max-w-md',
            '-translate-x-1/2 -translate-y-1/2',
            'rounded-modal border border-border',
            'bg-surface-raised p-5 shadow-2xl',
            'focus:outline-none',
          ].join(' ')}
          onEscapeKeyDown={(event) => {
            if (isPending) {
              event.preventDefault()
            }
          }}
          onPointerDownOutside={(event) => {
            if (isPending) {
              event.preventDefault()
            }
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogPrimitive.Title className="text-heading-sm font-semibold text-foreground">
                Reset Demo Data
              </DialogPrimitive.Title>

              <DialogPrimitive.Description className="mt-1 text-body-lg text-foreground-secondary">
                Restore all incidents, notes, timelines, and statuses to their
                original demo state.
              </DialogPrimitive.Description>
            </div>

            <DialogPrimitive.Close asChild>
              <IconButton
                label="Close reset dialog"
                icon={<X />}
                disabled={isPending}
              />
            </DialogPrimitive.Close>
          </div>

          <div className="mt-5">
            {status === 'success' ? (
              <Alert tone="success" title="Demo data restored">
                The original OpsPulse dataset is ready.
              </Alert>
            ) : (
              <Alert tone="warning" title="This replaces local changes">
                Created incidents and all saved incident updates will be
                removed.
              </Alert>
            )}

            {status === 'error' && errorMessage !== null && (
              <Alert
                role="alert"
                tone="critical"
                title="Reset failed"
                className="mt-3"
              >
                {errorMessage}
              </Alert>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-2">
            {status === 'success' ? (
              <Button onClick={handleFinish}>Return to dashboard</Button>
            ) : (
              <>
                <DialogPrimitive.Close asChild>
                  <Button variant="secondary" disabled={isPending}>
                    Cancel
                  </Button>
                </DialogPrimitive.Close>

                <Button
                  variant="destructive"
                  isLoading={isPending}
                  loadingText="Resetting…"
                  onClick={() => {
                    void handleReset()
                  }}
                >
                  <RotateCcw aria-hidden="true" className="size-4" />
                  Reset demo data
                </Button>
              </>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
