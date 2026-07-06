import axios from 'axios'
import { BASE_URL } from './endpoints'
import { getAccessToken, getRefreshToken, setTokens, removeTokens } from '../utils/token'
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
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  const cartId = getCartId()
  if (cartId) config.headers['x-cart-id'] = cartId
  return config
})

axiosClientAuth.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
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

      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        isRefreshing = false
        removeTokens()
        window.location.href = '/user/login'
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post(`${BASE_URL}/api/user/refresh-token`, { refreshToken })
        setTokens(data.data)
        processQueue(null, data.data.accessToken)
        original.headers.Authorization = `Bearer ${data.data.accessToken}`
        return axiosClientAuth(original)
      } catch (err) {
        processQueue(err, null)
        removeTokens()
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