import axios from 'axios'
import { BASE_URL } from './endpoints'

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

axiosClient.interceptors.request.use(config => {
  const cartId = localStorage.getItem('cartId')
  if (cartId) config.headers['x-cart-id'] = cartId
  return config
})

export default axiosClient