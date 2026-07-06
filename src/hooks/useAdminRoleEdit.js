import { useState, useEffect, useCallback } from 'react'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import axiosAdminAuth from '../api/axiosAdminAuth'
import API from '../api/endpoints'

function useAdminRoleEdit(id) {
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    setLoading(true)
    axiosAdminAuth.get(API.adminRoleEdit(id))
      .then(res => setRole(res.data.data?.data || null))
      .catch(() => message.error('Không thể tải nhóm quyền'))
      .finally(() => setLoading(false))
  }, [id])

  const updateRole = useCallback(async (values) => {
    setSubmitting(true)
    try {
      await axiosAdminAuth.patch(API.adminRoleEdit(id), values)
      message.success('Cập nhật nhóm quyền thành công')
      navigate('/admin/roles')
    } catch {
      message.error('Cập nhật nhóm quyền thất bại')
    } finally {
      setSubmitting(false)
    }
  }, [id, navigate])

  return { role, loading, submitting, updateRole }
}

export default useAdminRoleEdit
