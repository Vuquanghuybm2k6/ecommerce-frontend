import { useState, useEffect } from 'react'
import axiosClientAuth from '../api/axiosClientAuth'
import API from '../api/endpoints'
import useAuthStore from '../store/authStore'

function useEditProfile() {
  const [initialValues, setInitialValues] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const { setUser } = useAuthStore()

  useEffect(() => {
    setLoading(true)

    axiosClientAuth.get(API.userEdit)
      .then(res => {
        const user = res.data.data.user
        setInitialValues(user)
        setUser(user)
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [setUser])

  const updateProfile = async (formData) => {
    setSaving(true)
    setError(null)

    try {
      const res = await axiosClientAuth.patch(API.userEdit, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return res.data
    } catch (err) {
      const msg = err.response?.data?.message || 'Cập nhật thất bại'
      setError(msg)
      throw new Error(msg)
    } finally {
      setSaving(false)
    }
  }

  return { initialValues, loading, saving, error, updateProfile }
}

export default useEditProfile
