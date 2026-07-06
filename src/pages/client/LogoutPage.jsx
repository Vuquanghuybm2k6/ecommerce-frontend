import { useEffect } from 'react'
import { Spin } from 'antd'
import useAuth from '../../hooks/useAuth'

function LogoutPage() {
  const { logoutUser } = useAuth()

  useEffect(() => {
    logoutUser()
  }, [logoutUser])

  return (
    <div className="auth-page">
      <Spin size="large" tip="Đang đăng xuất..." />
    </div>
  )
}

export default LogoutPage
