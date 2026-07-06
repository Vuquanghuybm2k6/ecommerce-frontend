import { useState, useEffect, useCallback } from 'react'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import axiosAdminAuth from '../api/axiosAdminAuth'
import API from '../api/endpoints'

function useAdminCategoryEdit(id) {
  const [category, setCategory] = useState(null)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    setLoading(true)
    axiosAdminAuth.get(API.adminCategoryEdit(id))
      .then(res => {
        const data = res.data.data
        setCategory(data.data || null)
        setRecords(data.records || [])
      })
      .catch(() => message.error('Không thể tải danh mục'))
      .finally(() => setLoading(false))
  }, [id])

  const updateCategory = useCallback(async (formData) => {
    setSubmitting(true)
    try {
      await axiosAdminAuth.patch(API.adminCategoryEdit(id), formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      message.success('Cập nhật danh mục thành công')
      navigate('/admin/products-category')
    } catch {
      message.error('Cập nhật danh mục thất bại')
    } finally {
      setSubmitting(false)
    }
  }, [id, navigate])

  return { category, records, loading, submitting, updateCategory }
}

export default useAdminCategoryEdit
