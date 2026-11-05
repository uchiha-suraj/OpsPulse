import type { PropsWithChildren } from 'react'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { ThemeProvider } from './ThemeProvider'
import { queryClient } from './queryClient'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipPrimitive.Provider delayDuration={400} skipDelayDuration={100}>
          {children}
        </TooltipPrimitive.Provider>
      </ThemeProvider>

      {import.meta.env.DEV ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
    </QueryClientProvider>
  )
}
