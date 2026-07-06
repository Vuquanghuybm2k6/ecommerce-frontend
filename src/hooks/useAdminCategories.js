import { useState, useEffect, useCallback } from 'react'
import { message } from 'antd'
import axiosAdminAuth from '../api/axiosAdminAuth'
import API from '../api/endpoints'

function useAdminCategories() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchRecords = useCallback(() => {
    setLoading(true)
    axiosAdminAuth.get(API.adminCategories)
      .then(res => setRecords(res.data.data?.records || []))
      .catch(() => message.error('Không thể tải danh mục'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchRecords() }, [fetchRecords])

  const deleteCategory = useCallback(async (id, title) => {
    try {
      await axiosAdminAuth.patch(API.adminCategoryDelete(id))
      message.success(`Xóa danh mục "${title}" thành công`)
      fetchRecords()
    } catch (err) {
      const msg = err.response?.data?.message || 'Xóa danh mục thất bại'
      message.error(msg)
    }
  }, [fetchRecords])

  return { records, loading, deleteCategory }
}

export default useAdminCategories
