import { useState, useEffect, useCallback } from 'react'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import axiosAdminAuth from '../api/axiosAdminAuth'
import API from '../api/endpoints'

function useAdminProductCreate() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    axiosAdminAuth.get(API.adminProductCreate)
      .then(res => setCategories(res.data.data?.category || []))
      .catch(() => message.error('Không thể tải danh mục'))
      .finally(() => setLoading(false))
  }, [])

  const createProduct = useCallback(async (formData) => {
    setSubmitting(true)
    try {
      await axiosAdminAuth.post(API.adminProductCreate, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      message.success('Tạo sản phẩm thành công')
      navigate('/admin/products')
    } catch {
      message.error('Tạo sản phẩm thất bại')
    } finally {
      setSubmitting(false)
    }
  }, [navigate])

  return { categories, loading, submitting, createProduct }
}

export default useAdminProductCreate
