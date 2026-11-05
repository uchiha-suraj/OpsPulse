import { create } from 'zustand'
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from 'zustand/middleware'

import { isTheme, type Theme } from '@/types/theme'

const THEME_STORAGE_KEY = 'opspulse:theme'

interface ThemeStore {
  setTheme: (theme: Theme) => void
  theme: Theme
  toggleTheme: () => void
}

const safeThemeStorage: StateStorage = {
  getItem(name) {
    try {
      return window.localStorage.getItem(name)
    } catch {
      return null
    }
  },

  removeItem(name) {
    try {
      window.localStorage.removeItem(name)
    } catch {
      // Theme persistence is optional; in-memory state remains usable.
    }
  },

  setItem(name, value) {
    try {
      window.localStorage.setItem(name, value)
    } catch {
      // Theme persistence is optional; in-memory state remains usable.
    }
  },
}

function getPersistedTheme(value: unknown): Theme | undefined {
  if (typeof value !== 'object' || value === null || !('theme' in value)) {
    return undefined
  }

  return isTheme(value.theme) ? value.theme : undefined
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'dark',

      setTheme(theme) {
        set({ theme })
      },

      toggleTheme() {
        const nextTheme = get().theme === 'dark' ? 'light' : 'dark'

        set({ theme: nextTheme })
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      storage: createJSONStorage(() => safeThemeStorage),
      partialize: (state) => ({
        theme: state.theme,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        theme: getPersistedTheme(persistedState) ?? currentState.theme,
      }),
    },
  ),
)
