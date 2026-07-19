import { create } from 'zustand'
import { getAccessToken, setTokens, removeTokens } from '../utils/token'

const isTokenExpired = (token) => {
  if (!token) return true
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: !!getAccessToken() && !isTokenExpired(getAccessToken()),

  login: (tokens, user) => {
    setTokens(tokens)
    set({ user, isAuthenticated: true })
  },

  logout: () => {
    removeTokens()
    set({ user: null, isAuthenticated: false })
  },

  setUser: (user) => set({ user }),
}))

export default useAuthStore