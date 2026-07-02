import { create } from 'zustand'
import { getAccessToken, setTokens, removeTokens } from '../utils/token'

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: !!getAccessToken(),

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