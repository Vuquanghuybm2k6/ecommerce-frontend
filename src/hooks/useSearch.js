import { useState, useEffect } from 'react'
import axiosClient from '../api/axiosClient'
import API from '../api/endpoints'

function useSearch(keyword) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!keyword) {
      setProducts([])
      return
    }

    setLoading(true)
    setError(null)

    axiosClient.get(API.search, { params: { keyword } })
      .then(res => setProducts(res.data.data.products || []))
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [keyword])

  return { products, loading, error }
}

export default useSearch
