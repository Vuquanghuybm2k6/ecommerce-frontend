import { useState, useEffect, useCallback } from 'react'
import { message } from 'antd'
import axiosAdminAuth from '../api/axiosAdminAuth'
import API from '../api/endpoints'
import useAdminAuthStore from '../store/adminAuthStore'

function useAdminMyAccount() {
  const { setUser } = useAdminAuthStore()
  const [user, setLocalUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    axiosAdminAuth.get(API.adminMyAccount)
      .then(res => {
        const u = res.data.data?.user || null
        setUser(u)
        setLocalUser(u)
      })
      .catch(() => message.error('Không thể tải thông tin'))
      .finally(() => setLoading(false))
  }, [setUser])

  const updateProfile = useCallback(async (formData) => {
    try {
      const res = await axiosAdminAuth.patch(API.adminMyAccountEdit, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      message.success(res.data?.message || 'Cập nhật thành công')
      const { data } = await axiosAdminAuth.get(API.adminMyAccount)
      setUser(data.data?.user || null)
      setLocalUser(data.data?.user || null)
    } catch (err) {
      const msg = err.response?.data?.message || 'Cập nhật thất bại'
      message.error(msg)
    }
  }, [setUser])

  return { user, loading, updateProfile }
}

export default useAdminMyAccount
