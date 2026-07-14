import { useState, useEffect, useCallback } from 'react'
import { message } from 'antd'
import axiosClientAuth from '../api/axiosClientAuth'
import API from '../api/endpoints'

function useMyReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(null)

  const fetchReviews = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const res = await axiosClientAuth.get(API.reviewsUser, { params: { page } })
      setReviews(res.data.data.reviews || [])
      setPagination(res.data.data.pagination)
    } catch {
      setReviews([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const deleteReview = async (id) => {
    try {
      await axiosClientAuth.delete(API.reviewsDelete(id))
      message.success('Xóa đánh giá thành công')
      fetchReviews()
    } catch (err) {
      message.error(err.response?.data?.message || 'Xóa thất bại')
    }
  }

  const updateReview = async (id, data) => {
    try {
      await axiosClientAuth.patch(API.reviewsUpdate(id), data)
      message.success('Cập nhật đánh giá thành công')
      fetchReviews()
      return true
    } catch (err) {
      message.error(err.response?.data?.message || 'Cập nhật thất bại')
      return false
    }
  }

  return { reviews, loading, pagination, refetch: fetchReviews, deleteReview, updateReview }
}

export default useMyReviews
