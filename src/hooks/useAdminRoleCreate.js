import { useState, useCallback } from 'react'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import axiosAdminAuth from '../api/axiosAdminAuth'
import API from '../api/endpoints'

function useAdminRoleCreate() {
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const createRole = useCallback(async (values) => {
    setSubmitting(true)
    try {
      await axiosAdminAuth.post(API.adminRoleCreate, values)
      message.success('Tạo nhóm quyền thành công')
      navigate('/admin/roles')
    } catch {
      message.error('Tạo nhóm quyền thất bại')
    } finally {
      setSubmitting(false)
    }
  }, [navigate])

  return { submitting, createRole }
}

export default useAdminRoleCreate
