import { useState, useEffect, useCallback } from 'react'
import { message } from 'antd'
import axiosAdminAuth from '../api/axiosAdminAuth'
import API from '../api/endpoints'

function useAdminRolePermissions() {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchRoles = useCallback(() => {
    setLoading(true)
    axiosAdminAuth.get(API.adminRolePermissions)
      .then(res => setRoles(res.data.data?.records || []))
      .catch(() => message.error('Không thể tải danh sách quyền'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchRoles() }, [fetchRoles])

  const savePermissions = useCallback(async (permissionsData) => {
    setSaving(true)
    try {
      await axiosAdminAuth.patch(API.adminRolePermissions, {
        permissions: JSON.stringify(permissionsData)
      })
      message.success('Cập nhật phân quyền thành công')
      fetchRoles()
    } catch {
      message.error('Cập nhật phân quyền thất bại')
    } finally {
      setSaving(false)
    }
  }, [fetchRoles])

  return { roles, loading, saving, savePermissions }
}

export default useAdminRolePermissions
