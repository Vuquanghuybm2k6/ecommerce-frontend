import { useState, useEffect, useCallback } from 'react'
import { message, Modal } from 'antd'
import axiosAdminAuth from '../api/axiosAdminAuth'
import API from '../api/endpoints'

function useAdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(null)
  const [statusCounts, setStatusCounts] = useState({})

  const fetchReviews = useCallback(async (params = {}) => {
    setLoading(true)
    try {
      const res = await axiosAdminAuth.get(API.adminReviews, { params })
      setReviews(res.data.data.reviews || [])
      setPagination(res.data.data.pagination)
      setStatusCounts(res.data.data.statusCounts || {})
    } catch {
      setReviews([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const deleteReview = async (id, reason) => {
    try {
      await axiosAdminAuth.delete(API.adminReviewDelete(id), { data: { reason } })
      message.success('Đã xóa đánh giá và gửi thông báo đến người dùng')
      fetchReviews()
    } catch (err) {
      message.error(err.response?.data?.message || 'Xóa thất bại')
    }
  }

  return { reviews, loading, pagination, statusCounts, refetch: fetchReviews, deleteReview }
}

export default useAdminReviews
