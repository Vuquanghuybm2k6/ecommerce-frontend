import { useState, useEffect } from 'react'
import axiosClientAuth from '../api/axiosClientAuth'
import API from '../api/endpoints'
import useAuthStore from '../store/authStore'

function useUserInfo() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { setUser } = useAuthStore()

  useEffect(() => {
    setLoading(true)
    setError(null)

    axiosClientAuth.get(API.userInfo)
      .then(res => {
        const user = res.data.data.user
        setUser(user)
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [setUser])

  return { loading, error }
}

export default useUserInfo
