import { useLayoutEffect, type PropsWithChildren } from 'react'

import { useThemeStore } from '@/app/stores/themeStore'
import { applyThemeToDocument } from '@/app/theme/applyTheme'

export function ThemeProvider({ children }: PropsWithChildren) {
  const theme = useThemeStore((state) => state.theme)

  useLayoutEffect(() => {
    applyThemeToDocument(theme)
  }, [theme])

  return children
}
