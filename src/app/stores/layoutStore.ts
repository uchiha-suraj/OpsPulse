import { create } from 'zustand'

interface LayoutStore {
  isSidebarCollapsed: boolean
  setSidebarCollapsed: (isCollapsed: boolean) => void
  toggleSidebar: () => void
}

export const useLayoutStore = create<LayoutStore>()((set) => ({
  isSidebarCollapsed: false,

  setSidebarCollapsed(isCollapsed) {
    set({
      isSidebarCollapsed: isCollapsed,
    })
  },

  toggleSidebar() {
    set((state) => ({
      isSidebarCollapsed: !state.isSidebarCollapsed,
    }))
  },
}))
