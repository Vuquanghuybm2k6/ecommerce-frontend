import axios from 'axios'
import { BASE_URL } from './endpoints'
import useAuthStore from '../store/authStore'
import { getCartId } from '../utils/cartId'

const axiosClientAuth = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

let isRefreshing = false
let failedQueue = [] // đây là một mảng để lưu trữ các request bị thất bại khi token hết hạn, đang chờ để được xử lý refresh

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error) // nếu thất bại thì tất cả các request đang đợi nhận lỗi
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = [] // xóa hàng đợi sau khi đã xử lý xong
}

axiosClientAuth.interceptors.request.use(config => { // trước khi gọi đến axiosClientAuth.get('/api/products') thì sẽ gọi đến hàm này, config là các thông tin của request
  const { accessToken } = useAuthStore.getState()
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}` // thêm accessToken vào header Authorization nếu có
  const cartId = getCartId()
  if (cartId) config.headers['x-cart-id'] = cartId // thêm cartId vào header x-cart-id nếu có
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
        // fe gọi api refresh token để lấy access token mới, nếu thành công thì lưu access token mới vào store và gọi lại request ban đầu với access token mới
        const { data } = await axios.post(`${BASE_URL}/api/user/refresh-token`, {}, { withCredentials: true }) // axios.post({url}, {data}, {config}) với withCredentials: true để gửi cookie lên server
        useAuthStore.getState().setAccessToken(data.data.accessToken) // lấy access token mới từ sv và lưu nó vào auth store
        processQueue(null, data.data.accessToken) // báo cho tat cả các request đang đợi rằng đã có access token mới
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