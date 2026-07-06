import { useState, useEffect, useCallback } from 'react'
import { message } from 'antd'
import axiosAdminAuth from '../api/axiosAdminAuth'
import API from '../api/endpoints'

function useAdminProducts({ status, keyword, page, sortKey, sortValue } = {}) {
  const [products, setProducts] = useState([])
  const [filterStatus, setFilterStatus] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = useCallback(() => {
    setLoading(true)
    setError(null)
    const params = {}
    if (status) params.status = status
    if (keyword) params.keyword = keyword
    if (page) params.page = page
    if (sortKey) params.sortKey = sortKey
    if (sortValue) params.sortValue = sortValue
    axiosAdminAuth.get(API.adminProducts, { params })
      .then(res => {
        const data = res.data.data
        setProducts(data.products || [])
        setFilterStatus(data.filterStatus || [])
        setPagination(data.pagination || null)
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [status, keyword, page, sortKey, sortValue])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const changeStatus = useCallback(async (id, newStatus) => {
    try {
      await axiosAdminAuth.patch(API.adminProductChangeStatus(newStatus, id))
      message.success('Cập nhật trạng thái thành công')
      fetchProducts()
    } catch {
      message.error('Cập nhật trạng thái thất bại')
    }
  }, [fetchProducts])

  const changeMulti = useCallback(async (type, ids) => {
    try {
      await axiosAdminAuth.patch(API.adminProductChangeMulti, { type, ids: ids.join(', ') })
      message.success('Thao tác thành công')
      fetchProducts()
    } catch {
      message.error('Thao tác thất bại')
    }
  }, [fetchProducts])

  const deleteProduct = useCallback(async (id) => {
    try {
      await axiosAdminAuth.patch(API.adminProductDelete(id))
      message.success('Xóa sản phẩm thành công')
      fetchProducts()
    } catch {
      message.error('Xóa sản phẩm thất bại')
    }
  }, [fetchProducts])

  return { products, filterStatus, pagination, loading, error, changeStatus, changeMulti, deleteProduct }
}

export default useAdminProducts
