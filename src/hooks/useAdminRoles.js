import { useState, useEffect, useCallback } from 'react'
import { message } from 'antd'
import axiosAdminAuth from '../api/axiosAdminAuth'
import API from '../api/endpoints'

function useAdminRoles({ keyword, page } = {}) {
  const [roles, setRoles] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchRoles = useCallback(() => {
    setLoading(true)
    const params = {}
    if (keyword) params.keyword = keyword
    if (page) params.page = page
    axiosAdminAuth.get(API.adminRoles, { params })
      .then(res => {
        setRoles(res.data.data?.records || [])
        setPagination(res.data.data?.pagination || null)
      })
      .catch(() => message.error('Không thể tải nhóm quyền'))
      .finally(() => setLoading(false))
  }, [keyword, page])

  useEffect(() => { fetchRoles() }, [fetchRoles])

  const deleteRole = useCallback(async (id, title) => {
    try {
      await axiosAdminAuth.patch(API.adminRoleDelete(id))
      message.success(`Xóa nhóm quyền "${title}" thành công`)
      fetchRoles()
    } catch {
      message.error('Xóa nhóm quyền thất bại')
    }
  }, [fetchRoles])

  return { roles, pagination, loading, deleteRole }
}

export default useAdminRoles
