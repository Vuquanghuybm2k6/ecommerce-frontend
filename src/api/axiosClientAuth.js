import axios from 'axios'
import { BASE_URL } from './endpoints'
import { getAccessToken, setTokens, removeTokens } from '../utils/token'

const axiosClientAuth = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

axiosClientAuth.interceptors.request.use(config => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  const cartId = localStorage.getItem('cartId')
  if (cartId) config.headers['x-cart-id'] = cartId
  return config
})

axiosClientAuth.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        removeTokens()
        window.location.href = '/user/login'
        return Promise.reject(error)
      }
      try {
        const { data } = await axios.post(`${BASE_URL}/api/user/refresh-token`, { refreshToken })
        setTokens(data.data)
        original.headers.Authorization = `Bearer ${data.data.accessToken}`
        return axiosClientAuth(original)
      } catch {
        removeTokens()
        window.location.href = '/user/login'
      }
    }
    return Promise.reject(error)
  }
)

export default axiosClientAuth