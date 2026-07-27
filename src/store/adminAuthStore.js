import { create } from 'zustand'
import axios from 'axios'
import { BASE_URL } from '../api/endpoints'
import { removeAdminTokens } from '../utils/token'
import axiosAdminAuth from '../api/axiosAdminAuth'
import API from '../api/endpoints'

const useAdminAuthStore = create((set, get) => ({
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

  fetchUser: async () => {
    try {
      const res = await axiosAdminAuth.get(API.adminMyAccount)
      if (res.data.data?.user) {
        const userData = res.data.data.user
        userData.role = res.data.data.role
        set({ user: userData })
      }
    } catch {
      // ignore
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