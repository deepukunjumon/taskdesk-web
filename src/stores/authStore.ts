import { create } from 'zustand'
import * as authApi from '@/api/auth'
import { AUTH_TOKEN_STORAGE_KEY } from '@/lib/constants'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isHydrated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  hydrate: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem(AUTH_TOKEN_STORAGE_KEY),
  isHydrated: false,

  login: async (email, password) => {
    const { user, token } = await authApi.login({ email, password })
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token)
    set({ user, token })
  },

  logout: async () => {
    try {
      await authApi.logout()
    } finally {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
      set({ user: null, token: null })
    }
  },

  hydrate: async () => {
    const token = get().token
    if (!token) {
      set({ isHydrated: true })
      return
    }

    try {
      const user = await authApi.me()
      set({ user, isHydrated: true })
    } catch {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
      set({ user: null, token: null, isHydrated: true })
    }
  },
}))
