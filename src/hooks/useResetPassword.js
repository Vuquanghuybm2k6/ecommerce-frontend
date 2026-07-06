import { useState } from 'react'
import axiosClientAuth from '../api/axiosClientAuth'
import API from '../api/endpoints'
import useAuthStore from '../store/authStore'

function useResetPassword() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { logout } = useAuthStore()

  const resetPassword = async (password, confirmPassword) => {
    setLoading(true)
    setError(null)

    try {
      await axiosClientAuth.post(API.userResetPassword, { password, confirmPassword })
      logout()
      return true
    } catch (err) {
      const msg = err.response?.data?.message || 'Đổi mật khẩu thất bại'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  return { resetPassword, loading, error }
}

export default useResetPassword
