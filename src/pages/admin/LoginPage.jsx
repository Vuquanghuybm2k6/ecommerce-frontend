import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Typography, Divider, message } from 'antd'
import { GoogleOutlined } from '@ant-design/icons'
import useAdminAuth from '../../hooks/useAdminAuth'
import useAdminAuthStore from '../../store/adminAuthStore'
import { setAdminTokens } from '../../utils/token'
import axiosClient from '../../api/axiosClient'
import { BASE_URL } from '../../api/endpoints'
import './LoginPage.css'

const { Title, Text } = Typography

function AdminLoginPage() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { loginAdmin, fetchAdminUser, loading, error } = useAdminAuth()
  const { login: storeLogin, setUser, isAuthenticated } = useAdminAuthStore()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin')
      return
    }

    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const authError = params.get('error')

    if (authError) {
      message.error('Đăng nhập Google thất bại')
      window.history.replaceState({}, '', '/admin/login')
    }

    if (code) {
      axiosClient.post('/api/admin/auth/exchange-code', { code })
        .then(res => {
          const { accessToken, refreshToken } = res.data.data
          setAdminTokens({ accessToken, refreshToken })
          storeLogin({ accessToken, refreshToken }, {})
          return fetchAdminUser()
        })
        .then(() => {
          window.history.replaceState({}, '', '/admin/login')
          navigate('/admin')
        })
        .catch(() => {
          message.error('Đăng nhập thất bại')
        })
    }
  }, [isAuthenticated, navigate, storeLogin, setUser, fetchAdminUser])

  const handleSubmit = async (values) => {
    await loginAdmin(values.email, values.password)
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <Title level={3} className="auth-title">Admin - Đăng nhập</Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input placeholder="admin@example.com" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password placeholder="••••••••" size="large" />
          </Form.Item>

          {error && (
            <Text type="danger" className="auth-error">{error}</Text>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={loading}>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <Divider>Hoặc</Divider>

        <a href={`${BASE_URL}/api/admin/auth/google`} className="google-btn">
          <Button icon={<GoogleOutlined />} size="large" block>
            Đăng nhập bằng Google
          </Button>
        </a>
      </div>
    </div>
  )
}

export default AdminLoginPage
