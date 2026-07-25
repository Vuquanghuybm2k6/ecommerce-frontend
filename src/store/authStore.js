import { create } from 'zustand'
import axios from 'axios'
import { BASE_URL } from '../api/endpoints'
import { removeTokens } from '../utils/token'

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitialized: false,

  initialize: async () => {
    try {
      const { data } = await axios.post(`${BASE_URL}/api/user/refresh-token`, {}, { withCredentials: true })
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
    removeTokens()
    set({ user: null, accessToken: null, isAuthenticated: false })
  },

  setUser: (user) => set({ user }),
}))

export default useAuthStore