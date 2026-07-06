import { useState, useEffect, useCallback } from 'react'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import axiosAdminAuth from '../api/axiosAdminAuth'
import API from '../api/endpoints'

function useAdminCategoryCreate() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    axiosAdminAuth.get(API.adminCategoryCreate)
      .then(res => setRecords(res.data.data?.records || []))
      .catch(() => message.error('Không thể tải danh mục'))
      .finally(() => setLoading(false))
  }, [])

  const createCategory = useCallback(async (formData) => {
    setSubmitting(true)
    try {
      await axiosAdminAuth.post(API.adminCategoryCreate, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      message.success('Tạo danh mục thành công')
      navigate('/admin/products-category')
    } catch {
      message.error('Tạo danh mục thất bại')
    } finally {
      setSubmitting(false)
    }
  }, [navigate])

  return { records, loading, submitting, createCategory }
}

export default useAdminCategoryCreate
