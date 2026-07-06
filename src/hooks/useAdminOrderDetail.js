import { useState, useEffect } from 'react'
import { message } from 'antd'
import axiosAdminAuth from '../api/axiosAdminAuth'
import API from '../api/endpoints'

function useAdminOrderDetail(orderId) {
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!orderId) return
    setLoading(true)
    setError(null)
    axiosAdminAuth.get(API.adminOrderDetail(orderId))
      .then(res => setOrder(res.data.data.order || null))
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [orderId])

  const changeStatus = async (status) => {
    try {
      await axiosAdminAuth.patch(API.adminOrderChangeStatus(status, orderId))
      message.success('Cập nhật trạng thái thành công')
      setOrder(prev => ({ ...prev, status }))
    } catch {
      message.error('Cập nhật trạng thái thất bại')
    }
  }

  return { order, loading, error, changeStatus }
}

export default useAdminOrderDetail
