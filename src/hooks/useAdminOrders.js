import { useState, useEffect, useCallback } from 'react'
import { message } from 'antd'
import axiosAdminAuth from '../api/axiosAdminAuth'
import API from '../api/endpoints'

function useAdminOrders(params = {}) {
  const [orders, setOrders] = useState([])
  const [filterStatus, setFilterStatus] = useState([])
  const [pagination, setPagination] = useState({})
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axiosAdminAuth.get(API.adminOrders, { params })
      setOrders(res.data.data.orders || [])
      setFilterStatus(res.data.data.filterStatus || [])
      setPagination(res.data.data.pagination || {})
      setKeyword(res.data.data.keyword || '')
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const changeStatus = async (id, status, reason) => {
    try {
      await axiosAdminAuth.patch(API.adminOrderChangeStatus(id), { status, reason })
      message.success('Cập nhật trạng thái thành công')
      fetchOrders()
    } catch (err) {
      const msg = err.response?.data?.message || 'Cập nhật trạng thái thất bại'
      message.error(msg)
    }
  }

  const deleteOrder = async (id) => {
    try {
      await axiosAdminAuth.patch(API.adminOrderDelete(id))
      message.success('Xóa đơn hàng thành công')
      fetchOrders()
    } catch {
      message.error('Xóa đơn hàng thất bại')
    }
  }

  return { orders, filterStatus, pagination, keyword, loading, error, changeStatus, deleteOrder, refetch: fetchOrders }
}

export default useAdminOrders
