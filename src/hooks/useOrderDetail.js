import { useState, useEffect, useCallback } from 'react'
import { message } from 'antd'
import axiosClientAuth from '../api/axiosClientAuth'
import API from '../api/endpoints'

function useOrderDetail(orderId) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchOrder = useCallback(() => {
    if (!orderId) return
    setLoading(true)
    setError(null)
    axiosClientAuth.get(API.orderDetail(orderId))
      .then(res => setOrder(res.data.data.order || null))
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [orderId])

  useEffect(() => {
    fetchOrder()
  }, [fetchOrder])

  const cancelOrder = async () => {
    try {
      await axiosClientAuth.patch(API.orderCancel(orderId))
      message.success('Hủy đơn hàng thành công')
      fetchOrder()
    } catch (err) {
      const msg = err.response?.data?.message || 'Hủy đơn hàng thất bại'
      message.error(msg)
    }
  }

  return { order, loading, error, cancelOrder, refetch: fetchOrder }
}

export default useOrderDetail
