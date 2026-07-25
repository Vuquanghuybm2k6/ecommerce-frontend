import { useState } from 'react'
import axiosClient from '../api/axiosClient'
import API from '../api/endpoints'
import useAuthStore from '../store/authStore'

function useVerifyOtp() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { login } = useAuthStore()

  const verifyOtp = async (email, otp) => {
    setLoading(true)
    setError(null)

    try {
      const res = await axiosClient.post(API.userOtp, { email, otp })
      const { accessToken } = res.data.data
      login(accessToken, {})
      return true
    } catch (err) {
      const msg = err.response?.data?.message || 'Xác thực OTP thất bại'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  return { verifyOtp, loading, error }
}

export default useVerifyOtp
