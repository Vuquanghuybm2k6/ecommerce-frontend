import { useState, useEffect, useCallback } from 'react'
import { message } from 'antd'
import axiosAdminAuth from '../api/axiosAdminAuth'
import API from '../api/endpoints'

function useAdminAccounts({ keyword, page } = {}) {
  const [records, setRecords] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchRecords = useCallback(() => {
    setLoading(true)
    const params = {}
    if (keyword) params.keyword = keyword
    if (page) params.page = page
    axiosAdminAuth.get(API.adminAccounts, { params })
      .then(res => {
        setRecords(res.data.data?.records || [])
        setPagination(res.data.data?.pagination || null)
      })
      .catch(() => message.error('Không thể tải tài khoản'))
      .finally(() => setLoading(false))
  }, [keyword, page])

  useEffect(() => { fetchRecords() }, [fetchRecords])

  const changeStatus = useCallback(async (id, newStatus) => {
    try {
      await axiosAdminAuth.patch(API.adminAccountChangeStatus(newStatus, id))
      message.success('Cập nhật trạng thái thành công')
      fetchRecords()
    } catch {
      message.error('Cập nhật trạng thái thất bại')
    }
  }, [fetchRecords])

  const deleteAccount = useCallback(async (id, fullName) => {
    try {
      await axiosAdminAuth.patch(API.adminAccountDelete(id))
      message.success(`Xóa tài khoản "${fullName}" thành công`)
      fetchRecords()
    } catch {
      message.error('Xóa tài khoản thất bại')
    }
  }, [fetchRecords])

  return { records, pagination, loading, changeStatus, deleteAccount }
}

export default useAdminAccounts
