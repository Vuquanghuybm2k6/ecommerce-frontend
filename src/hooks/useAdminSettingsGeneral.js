import { useState, useEffect, useCallback } from 'react'
import { message } from 'antd'
import axiosAdminAuth from '../api/axiosAdminAuth'
import API from '../api/endpoints'

function useAdminSettingsGeneral() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setLoading(true)
    axiosAdminAuth.get(API.adminSettings)
      .then(res => setSettings(res.data.data?.settingGeneral || null))
      .catch(() => message.error('Không thể tải cài đặt'))
      .finally(() => setLoading(false))
  }, [])

  const saveSettings = useCallback(async (formData) => {
    setSaving(true)
    try {
      await axiosAdminAuth.patch(API.adminSettings, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      message.success('Cập nhật cài đặt thành công')
    } catch {
      message.error('Cập nhật cài đặt thất bại')
    } finally {
      setSaving(false)
    }
  }, [])

  return { settings, loading, saving, saveSettings }
}

export default useAdminSettingsGeneral
