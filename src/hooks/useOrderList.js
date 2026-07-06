import { useState, useEffect, useCallback } from 'react'
import axiosClientAuth from '../api/axiosClientAuth'
import API from '../api/endpoints'

function useOrderList() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchOrders = useCallback(async (pageNum = 1) => {
    setLoading(true)
    setError(null)
    try {
      const res = await axiosClientAuth.get(API.userOrders, { params: { page: pageNum } })
      setOrders(res.data.data.orders || [])
      setTotal(res.data.data.pagination?.totalItem || 0)
      setPage(pageNum)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const changePage = (pageNum) => {
    fetchOrders(pageNum)
  }

  return { orders, loading, error, refetch: fetchOrders, page, total, changePage }
}

export default useOrderList
