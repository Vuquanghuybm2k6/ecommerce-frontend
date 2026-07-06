import axios from 'axios'
import { BASE_URL } from './endpoints'
import { getAdminAccessToken, getAdminRefreshToken, setAdminTokens, removeAdminTokens } from '../utils/token'

const axiosAdminAuth = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

axiosAdminAuth.interceptors.request.use(config => {
  const token = getAdminAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

axiosAdminAuth.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refreshToken = getAdminRefreshToken()
      if (!refreshToken) {
        removeAdminTokens()
        window.location.href = '/admin/login'
        return Promise.reject(error)
      }
      try {
        const { data } = await axios.post(`${BASE_URL}/api/admin/auth/refresh-token`, { refreshToken })
        setAdminTokens(data.data)
        original.headers.Authorization = `Bearer ${data.data.accessToken}`
        return axiosAdminAuth(original)
      } catch {
        removeAdminTokens()
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  }
)

export default axiosAdminAuth