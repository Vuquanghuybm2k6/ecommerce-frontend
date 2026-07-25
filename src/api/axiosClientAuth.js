import axios from 'axios'
import { BASE_URL } from './endpoints'
import useAuthStore from '../store/authStore'
import { getCartId } from '../utils/cartId'

const axiosClientAuth = axios.create({
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

axiosClientAuth.interceptors.request.use(config => {
  const { accessToken } = useAuthStore.getState()
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  const cartId = getCartId()
  if (cartId) config.headers['x-cart-id'] = cartId
  return config
})

axiosClientAuth.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry && !original.url?.includes('/user/refresh-token')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          original.headers.Authorization = `Bearer ${token}`
          return axiosClientAuth(original)
        })
      }

      original._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(`${BASE_URL}/api/user/refresh-token`, {}, { withCredentials: true })
        useAuthStore.getState().setAccessToken(data.data.accessToken)
        processQueue(null, data.data.accessToken)
        original.headers.Authorization = `Bearer ${data.data.accessToken}`
        return axiosClientAuth(original)
      } catch (err) {
        processQueue(err, null)
        useAuthStore.getState().logout()
        window.location.href = '/user/login'
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)

export default axiosClientAuth