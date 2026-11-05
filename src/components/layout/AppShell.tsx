import { useEffect, useState, type PropsWithChildren } from 'react'

import { useLayoutStore } from '@/app/stores/layoutStore'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { cn } from '@/lib/utils/cn'

export function AppShell({ children }: PropsWithChildren) {
  const isSidebarCollapsed = useLayoutStore((state) => state.isSidebarCollapsed)

  const [isMobileNavigationOpen, setIsMobileNavigationOpen] = useState(false)

  useEffect(() => {
    const desktopMediaQuery = window.matchMedia('(min-width: 1024px)')

    function handleBreakpointChange(event: MediaQueryListEvent): void {
      if (event.matches) {
        setIsMobileNavigationOpen(false)
      }
    }

    desktopMediaQuery.addEventListener('change', handleBreakpointChange)

    return () => {
      desktopMediaQuery.removeEventListener('change', handleBreakpointChange)
    }
  }, [])

  return (
    <div className="min-h-dvh bg-canvas text-foreground">
      <a
        href="#main-content"
        className={[
          'fixed top-2 left-2 z-[100]',
          'translate-y-[-150%] rounded-control',
          'bg-accent px-3 py-2 text-body font-medium',
          'text-foreground-on-accent',
          'focus:translate-y-0 focus:outline-none',
          'focus:ring-2 focus:ring-focus-ring',
        ].join(' ')}
      >
        Skip to main content
      </a>

      <Sidebar />

      <div
        className={cn(
          [
            'min-h-dvh',
            'transition-[padding-left] duration-200',
            'motion-reduce:transition-none',
          ],
          isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-[232px]',
        )}
      >
        <TopBar
          isMobileNavigationOpen={isMobileNavigationOpen}
          onMobileNavigationOpenChange={setIsMobileNavigationOpen}
        />

        <main
          id="main-content"
          tabIndex={-1}
          className={[
            'min-h-[calc(100dvh-52px)] px-4 py-5',
            'outline-none',
            'lg:min-h-[calc(100dvh-56px)]',
            'lg:px-6',
          ].join(' ')}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
