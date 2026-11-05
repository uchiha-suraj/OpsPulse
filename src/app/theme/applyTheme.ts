import type { Theme } from '@/types/theme'

export function applyThemeToDocument(theme: Theme): void {
  document.documentElement.dataset.theme = theme
}
