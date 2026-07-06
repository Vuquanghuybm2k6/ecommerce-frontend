import { useState, useEffect, useCallback } from 'react'
import axiosClientAuth from '../api/axiosClientAuth'
import API from '../api/endpoints'

function useOrderList() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axiosClientAuth.get(API.userOrders)
      setOrders(res.data.data.orders || [])
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  return { orders, loading, error, refetch: fetchOrders }
}

export default useOrderList
