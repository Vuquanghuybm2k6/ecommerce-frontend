import { create } from 'zustand'
import { getAdminAccessToken, setAdminTokens, removeAdminTokens } from '../utils/token'

const useAdminAuthStore = create((set) => ({
  user: null,
  isAuthenticated: !!getAdminAccessToken(),

  login: (tokens, user) => {
    setAdminTokens(tokens)
    set({ user, isAuthenticated: true })
  },

  logout: () => {
    removeAdminTokens()
    set({ user: null, isAuthenticated: false })
  },

  setUser: (user) => set({ user }),
}))

export default useAdminAuthStore