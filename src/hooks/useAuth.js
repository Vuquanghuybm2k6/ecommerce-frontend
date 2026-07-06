import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosClient from '../api/axiosClient'
import axiosClientAuth from '../api/axiosClientAuth'
import API from '../api/endpoints'
import useAuthStore from '../store/authStore'
import { getRefreshToken } from '../utils/token'

function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { login: storeLogin, setUser, logout: storeLogout } = useAuthStore()
  const navigate = useNavigate()

  const fetchUser = async () => {
    try {
      const res = await axiosClientAuth.get(API.userInfo)
      setUser(res.data.data.user)
    } catch {
      storeLogout()
    }
  }

  const loginUser = async (email, password) => {
    setLoading(true)
    setError(null)

    try {
      const res = await axiosClient.post(API.userLogin, { email, password })
      const { user, accessToken, refreshToken } = res.data.data
      storeLogin({ accessToken, refreshToken }, user)
      await fetchUser()
      navigate('/')
    } catch (err) {
      const msg = err.response?.data?.message || 'Đăng nhập thất bại'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const registerUser = async (userData) => {
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('fullName', userData.fullName)
      formData.append('email', userData.email)
      formData.append('password', userData.password)
      if (userData.avatar) {
        formData.append('avatar', userData.avatar)
      }

      const res = await axiosClient.post(API.userRegister, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const { user, accessToken, refreshToken } = res.data.data
      storeLogin({ accessToken, refreshToken }, user)
      await fetchUser()
      navigate('/')
    } catch (err) {
      const msg = err.response?.data?.message || 'Đăng ký thất bại'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const logoutUser = async () => {
    try {
      const refreshToken = getRefreshToken()
      if (refreshToken) {
        await axiosClient.post(API.userLogout, { refreshToken })
      }
    } catch {
      // ignore logout errors
    }
    storeLogout()
    navigate('/user/login')
  }

  return { loginUser, registerUser, logoutUser, fetchUser, loading, error }
}

export default useAuth
