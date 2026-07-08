import { useState } from 'react'
import axiosClientAuth from '../api/axiosClientAuth'
import API from '../api/endpoints'
import { removeCartId } from '../utils/cartId'
import useCartStore from '../store/cartStore'

function usePlaceOrder() {
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState(null)
  const { setCart, setTotalQuantity } = useCartStore()

  const placeOrder = async (orderData) => {
    setPlacing(true)
    setError(null)

    try {
      const res = await axiosClientAuth.post(API.checkoutOrder, orderData)
      const { orderId, orderCode, paymentUrl } = res.data.data

      setCart(null)
      setTotalQuantity(0)
      removeCartId()

      if (paymentUrl) {
        window.location.href = paymentUrl
        return { orderId, orderCode, paymentUrl }
      }

      return { orderId, orderCode }
    } catch (err) {
      const msg = err.response?.data?.message || 'Đặt hàng thất bại'
      setError(msg)
      throw new Error(msg)
    } finally {
      setPlacing(false)
    }
  }

  return { placeOrder, placing, error }
}

export default usePlaceOrder
