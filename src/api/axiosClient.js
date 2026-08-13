import axios from 'axios' // thư viện axios dùng để gửi http request đến sv
import { BASE_URL } from './endpoints'
import { getCartId } from '../utils/cartId' // Đây là một function để lấy cartId của giỏ hàng hiện tại.
const axiosClient = axios.create({ // tạo một base url mặc định cho tất cả request, khi gọi axiosClient.get('/api/products') thì 
  // thực chất là axios.get('http://localhost:3000/api/products') vì đã có base url mặc định
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

axiosClient.interceptors.request.use(config => { // khi axiosClient gửi request đi thì sẽ gọi đến hàm này, 
  const cartId = getCartId()
  if (cartId) config.headers['x-cart-id'] = cartId
  return config
})

export default axiosClient