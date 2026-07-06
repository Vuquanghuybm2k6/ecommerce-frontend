import axios from 'axios'
import { BASE_URL } from './endpoints'
import { getCartId } from '../utils/cartId'

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

axiosClient.interceptors.request.use(config => {
  const cartId = getCartId()
  if (cartId) config.headers['x-cart-id'] = cartId
  return config
})

export default axiosClient