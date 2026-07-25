import { create } from 'zustand'
import axios from 'axios'
import { BASE_URL } from '../api/endpoints'
import { removeAdminTokens } from '../utils/token'

const useAdminAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitialized: false,

  initialize: async () => {
    try {
      const { data } = await axios.post(`${BASE_URL}/api/admin/auth/refresh-token`, {}, { withCredentials: true })
      set({
        accessToken: data.data.accessToken,
        isAuthenticated: true,
        isInitialized: true
      })
    } catch {
      set({ isInitialized: true })
    }
  },

  login: (accessToken, user) => {
    set({ accessToken, user, isAuthenticated: true })
  },

  setAccessToken: (accessToken) => {
    set({ accessToken, isAuthenticated: true })
  },

  logout: () => {
    removeAdminTokens()
    set({ user: null, accessToken: null, isAuthenticated: false })
  },

  setUser: (user) => set({ user }),
}))

export default useAdminAuthStore