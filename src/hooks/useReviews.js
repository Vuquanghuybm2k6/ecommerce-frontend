import { useState, useEffect, useCallback } from 'react'
import axiosClient from '../api/axiosClient'
import API from '../api/endpoints'

function useReviews(productId) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(null)

  const fetchReviews = useCallback(async (page = 1, sort = 'newest') => {
    if (!productId) return
    setLoading(true)
    try {
      const res = await axiosClient.get(API.reviewsByProduct(productId), {
        params: { page, sort }
      })
      setReviews(res.data.data.reviews || [])
      setPagination(res.data.data.pagination)
    } catch {
      setReviews([])
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  return { reviews, loading, pagination, refetch: fetchReviews }
}

export default useReviews
