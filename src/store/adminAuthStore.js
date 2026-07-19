import { create } from 'zustand'
import { getAdminAccessToken, setAdminTokens, removeAdminTokens } from '../utils/token'

const isTokenExpired = (token) => {
  if (!token) return true
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

const useAdminAuthStore = create((set) => ({
  user: null,
  isAuthenticated: !!getAdminAccessToken() && !isTokenExpired(getAdminAccessToken()),

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