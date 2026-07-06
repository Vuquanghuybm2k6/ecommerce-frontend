import { useState, useEffect } from 'react'
import axiosClient from '../api/axiosClient'
import API from '../api/endpoints'

function useCategoryProducts({ slug, page } = {}) {
  const [products, setProducts] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return

    setLoading(true)
    setError(null)

    const params = {}
    if (page) params.page = page

    axiosClient.get(API.productsByCategory(slug), { params })
      .then(res => {
        const data = res.data.data
        setProducts(data.products || [])
        setPagination(data.pagination || null)
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [slug, page])

  return { products, pagination, loading, error }
}

export default useCategoryProducts
