import { useState, useEffect } from 'react'
import axiosClient from '../api/axiosClient'
import API from '../api/endpoints'

function useOrderSuccess(orderId) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!orderId) return

    setLoading(true)
    setError(null)

    axiosClient.get(API.checkoutSuccess(orderId))
      .then(res => setOrder(res.data.data.order || null))
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [orderId])

  return { order, loading, error }
}

export default useOrderSuccess
