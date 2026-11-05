export const THEMES = ['dark', 'light'] as const

export type Theme = (typeof THEMES)[number]

export function isTheme(value: unknown): value is Theme {
  return value === 'dark' || value === 'light'
}
