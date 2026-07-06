import { useState, useEffect, useCallback } from 'react'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import axiosAdminAuth from '../api/axiosAdminAuth'
import API from '../api/endpoints'

function useAdminAccountCreate() {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    axiosAdminAuth.get(API.adminAccountCreate)
      .then(res => setRoles(res.data.data?.roles || []))
      .catch(() => message.error('Không thể tải danh sách quyền'))
      .finally(() => setLoading(false))
  }, [])

  const createAccount = useCallback(async (formData) => {
    setSubmitting(true)
    try {
      await axiosAdminAuth.post(API.adminAccountCreate, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      message.success('Tạo tài khoản thành công')
      navigate('/admin/accounts')
    } catch (err) {
      const msg = err.response?.data?.message || 'Tạo tài khoản thất bại'
      message.error(msg)
    } finally {
      setSubmitting(false)
    }
  }, [navigate])

  return { roles, loading, submitting, createAccount }
}

export default useAdminAccountCreate
