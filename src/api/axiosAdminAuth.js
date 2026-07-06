import axios from 'axios'
import { BASE_URL } from './endpoints'
import { getAdminAccessToken, getAdminRefreshToken, setAdminTokens, removeAdminTokens } from '../utils/token'

const axiosAdminAuth = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

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
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          original.headers.Authorization = `Bearer ${token}`
          return axiosAdminAuth(original)
        })
      }

      original._retry = true
      isRefreshing = true

      const refreshToken = getAdminRefreshToken()
      if (!refreshToken) {
        isRefreshing = false
        removeAdminTokens()
        window.location.href = '/admin/login'
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post(`${BASE_URL}/api/admin/auth/refresh-token`, { refreshToken })
        setAdminTokens(data.data)
        processQueue(null, data.data.accessToken)
        original.headers.Authorization = `Bearer ${data.data.accessToken}`
        return axiosAdminAuth(original)
      } catch (err) {
        processQueue(err, null)
        removeAdminTokens()
        window.location.href = '/admin/login'
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

export default axiosAdminAuth