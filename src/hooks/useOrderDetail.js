import { useState, useEffect } from 'react'
import axiosClientAuth from '../api/axiosClientAuth'
import API from '../api/endpoints'

function useOrderDetail(orderId) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!orderId) return

    setLoading(true)
    setError(null)

    axiosClientAuth.get(API.orderDetail(orderId))
      .then(res => setOrder(res.data.data.order || null))
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [orderId])

  return { order, loading, error }
}

export default useOrderDetail
