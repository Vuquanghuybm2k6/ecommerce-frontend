import { useState, useEffect, useCallback } from 'react'
import axiosClient from '../api/axiosClient'
import API from '../api/endpoints'
import useCartStore from '../store/cartStore'

function useCheckout() {
  const [cartDetail, setCartDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { cartId, updateCartId, setTotalQuantity } = useCartStore()

  const fetchCheckout = useCallback(async () => {
    if (!cartId) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await axiosClient.get(API.checkout)
      const detail = res.data.data.cartDetail
      setCartDetail(detail)
      updateCartId(detail._id)
      const qty = detail.products.reduce((sum, item) => sum + item.quantity, 0)
      setTotalQuantity(qty)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [cartId, updateCartId, setTotalQuantity])

  useEffect(() => {
    fetchCheckout()
  }, [fetchCheckout])

  return { cartDetail, loading, error, refetch: fetchCheckout }
}

export default useCheckout
