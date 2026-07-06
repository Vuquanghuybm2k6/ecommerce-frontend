import { useState, useEffect, useCallback } from 'react'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import axiosAdminAuth from '../api/axiosAdminAuth'
import API from '../api/endpoints'

function useAdminProductEdit(id) {
  const [product, setProduct] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    setLoading(true)
    axiosAdminAuth.get(API.adminProductEdit(id))
      .then(res => {
        const data = res.data.data
        setProduct(data.product || null)
        setCategories(data.category || [])
      })
      .catch(() => message.error('Không thể tải sản phẩm'))
      .finally(() => setLoading(false))
  }, [id])

  const updateProduct = useCallback(async (formData) => {
    setSubmitting(true)
    try {
      await axiosAdminAuth.patch(API.adminProductEdit(id), formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      message.success('Cập nhật sản phẩm thành công')
      navigate('/admin/products')
    } catch {
      message.error('Cập nhật sản phẩm thất bại')
    } finally {
      setSubmitting(false)
    }
  }, [id, navigate])

  return { product, categories, loading, submitting, updateProduct }
}

export default useAdminProductEdit
