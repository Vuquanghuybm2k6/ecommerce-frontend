import { useState, useEffect, useCallback } from 'react'
import { notification } from 'antd'
import axiosClient from '../api/axiosClient'
import API from '../api/endpoints'
import useCartStore from '../store/cartStore'

function useCart() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { cartId, updateCartId, setTotalQuantity, setCart: setCartStore } = useCartStore()

  const syncCart = useCallback((cartData) => {
    setCart(cartData)
    setCartStore(cartData)
    updateCartId(cartData._id)
    const qty = cartData.products
      ? cartData.products.reduce((sum, item) => sum + item.quantity, 0)
      : 0
    setTotalQuantity(qty)
  }, [updateCartId, setTotalQuantity, setCartStore])

  const fetchCart = useCallback(async () => {
    if (!cartId) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await axiosClient.get(API.cart)
      syncCart(res.data.data.cart)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [cartId, syncCart])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const deleteItem = async (productId) => {
    try {
      const res = await axiosClient.delete(API.cartDelete(productId))
      syncCart(res.data.data.cart)
      notification.success({ message: 'Thông báo', description: 'Đã xóa sản phẩm khỏi giỏ hàng', placement: 'topRight', duration: 3 })
    } catch (err) {
      notification.error({ message: 'Thông báo', description: 'Xóa sản phẩm thất bại', placement: 'topRight', duration: 3 })
      setError(err)
    }
  }

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await axiosClient.put(API.cartUpdate(productId), { quantity })
      syncCart(res.data.data.cart)
    } catch (err) {
      setError(err)
    }
  }

  return { cart, loading, error, deleteItem, updateQuantity, refetch: fetchCart }
}

export default useCart
