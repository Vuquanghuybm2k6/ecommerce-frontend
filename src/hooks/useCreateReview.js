import { useState } from 'react'
import { message } from 'antd'
import axiosClientAuth from '../api/axiosClientAuth'
import API from '../api/endpoints'

function useCreateReview() {
  const [loading, setLoading] = useState(false)

  const createReview = async (data) => {
    setLoading(true)
    try {
      await axiosClientAuth.post(API.reviewsCreate, data)
      message.success('Đánh giá thành công')
      return true
    } catch (err) {
      const msg = err.response?.data?.message || 'Đánh giá thất bại'
      message.error(msg)
      return false
    } finally {
      setLoading(false)
    }
  }

  return { createReview, loading }
}

export default useCreateReview
