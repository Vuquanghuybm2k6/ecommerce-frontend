import { useState, useEffect } from 'react'
import axiosAdminAuth from '../api/axiosAdminAuth'
import API from '../api/endpoints'

function useDashboard() {
  const [statistic, setStatistic] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    axiosAdminAuth.get(API.adminDashboard)
      .then(res => setStatistic(res.data.data.statistic))
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [])

  return { statistic, loading, error }
}

export default useDashboard
