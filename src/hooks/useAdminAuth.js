import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosClient from '../api/axiosClient'
import axiosAdminAuth from '../api/axiosAdminAuth'
import API from '../api/endpoints'
import useAdminAuthStore from '../store/adminAuthStore'

function useAdminAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { login: storeLogin, setUser, logout: storeLogout } = useAdminAuthStore()
  const navigate = useNavigate()

  const fetchAdminUser = async () => {
    try {
      const res = await axiosAdminAuth.get(API.adminLogin)
      if (res.data.data?.user) {
        setUser(res.data.data.user)
      }
    } catch {
      // token invalid
    }
  }

  const loginAdmin = async (email, password) => {
    setLoading(true)
    setError(null)

    try {
      const res = await axiosClient.post(API.adminLogin, { email, password })
      const { accessToken } = res.data.data
      storeLogin(accessToken, {})
      await fetchAdminUser()
      navigate('/admin')
    } catch (err) {
      const msg = err.response?.data?.message || 'Đăng nhập thất bại'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const logoutAdmin = async () => {
    try {
      await axiosClient.post(API.adminLogout, {}, { withCredentials: true })
    } catch {
      // ignore
    }
    storeLogout()
    navigate('/admin/login')
  }

  return { loginAdmin, logoutAdmin, fetchAdminUser, loading, error }
}

export default useAdminAuth