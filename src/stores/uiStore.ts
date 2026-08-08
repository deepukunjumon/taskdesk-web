import { create } from 'zustand'

export const SIDEBAR_MOBILE_BREAKPOINT = 768

interface UiState {
  isSidebarOpen: boolean
  toggleSidebar: () => void
  openSidebar: () => void
  closeSidebar: () => void
}

function getInitialSidebarState(): boolean {
  if (typeof window === 'undefined') return true
  return window.innerWidth >= SIDEBAR_MOBILE_BREAKPOINT
}

export const useUiStore = create<UiState>((set) => ({
  isSidebarOpen: getInitialSidebarState(),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
}))
