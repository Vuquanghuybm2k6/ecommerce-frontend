import { useState } from 'react'
import axiosClient from '../api/axiosClient'
import API from '../api/endpoints'

function useForgotPassword() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const sendOtp = async (email) => {
    setLoading(true)
    setError(null)

    try {
      const res = await axiosClient.post(API.userForgotPassword, { email })
      return { email: res.data.data.email }
    } catch (err) {
      const msg = err.response?.data?.message || 'Gửi OTP thất bại'
      setError(msg)
      throw new Error(msg)
    } finally {
      setLoading(false)
    }
  }

  return { sendOtp, loading, error }
}

export default useForgotPassword
