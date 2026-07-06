import { useState, useEffect } from 'react'
import axiosClient from '../api/axiosClient'
import API from '../api/endpoints'

function useProductDetail(slug) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) return

    setLoading(true)
    setError(null)

    axiosClient.get(API.productDetail(slug))
      .then(res => setProduct(res.data.data.product || null))
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [slug])

  return { product, loading, error }
}

export default useProductDetail
