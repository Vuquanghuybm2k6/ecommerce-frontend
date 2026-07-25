import axios from 'axios'
import { BASE_URL } from './endpoints'
import useAdminAuthStore from '../store/adminAuthStore'

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
  const { accessToken } = useAdminAuthStore.getState()
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

axiosAdminAuth.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry && !original.url?.includes('/admin/auth/refresh-token')) {
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

      try {
        const { data } = await axios.post(`${BASE_URL}/api/admin/auth/refresh-token`, {}, { withCredentials: true })
        useAdminAuthStore.getState().setAccessToken(data.data.accessToken)
        processQueue(null, data.data.accessToken)
        original.headers.Authorization = `Bearer ${data.data.accessToken}`
        return axiosAdminAuth(original)
      } catch (err) {
        processQueue(err, null)
        useAdminAuthStore.getState().logout()
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