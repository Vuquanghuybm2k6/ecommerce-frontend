import { useState, useEffect, useCallback } from 'react'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import axiosAdminAuth from '../api/axiosAdminAuth'
import API from '../api/endpoints'

function useAdminAccountEdit(id) {
  const [account, setAccount] = useState(null)
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    setLoading(true)
    axiosAdminAuth.get(API.adminAccountEdit(id))
      .then(res => {
        setAccount(res.data.data?.account || null)
        setRoles(res.data.data?.roles || [])
      })
      .catch(() => message.error('Không thể tải tài khoản'))
      .finally(() => setLoading(false))
  }, [id])

  const updateAccount = useCallback(async (formData) => {
    setSubmitting(true)
    try {
      await axiosAdminAuth.patch(API.adminAccountEdit(id), formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      message.success('Cập nhật tài khoản thành công')
      navigate('/admin/accounts')
    } catch (err) {
      const msg = err.response?.data?.message || 'Cập nhật tài khoản thất bại'
      message.error(msg)
    } finally {
      setSubmitting(false)
    }
  }, [id, navigate])

  return { account, roles, loading, submitting, updateAccount }
}

export default useAdminAccountEdit
