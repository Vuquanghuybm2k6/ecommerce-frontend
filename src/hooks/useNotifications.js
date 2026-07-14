import { useState, useEffect, useCallback } from 'react'
import axiosClientAuth from '../api/axiosClientAuth'
import API from '../api/endpoints'

function useNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState(null)

  const fetchNotifications = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const res = await axiosClientAuth.get(API.notifications, { params: { page } })
      setNotifications(res.data.data.notifications || [])
      setPagination(res.data.data.pagination)
    } catch {
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const dispatchCountChange = () => {
    window.dispatchEvent(new CustomEvent('notifications-read'))
  }

  const markRead = async (id) => {
    try {
      await axiosClientAuth.patch(API.notificationRead(id))
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, read: true } : n)
      )
      dispatchCountChange()
    } catch {
      // silent
    }
  }

  const markAllRead = async () => {
    try {
      await axiosClientAuth.patch(API.notificationsReadAll)
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      dispatchCountChange()
    } catch {
      // silent
    }
  }

  return { notifications, loading, pagination, refetch: fetchNotifications, markRead, markAllRead }
}

export default useNotifications
