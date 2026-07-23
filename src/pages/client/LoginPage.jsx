import { useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Form, Input, Button, Typography, Divider, message } from 'antd'
import { GoogleOutlined } from '@ant-design/icons'
import useAuth from '../../hooks/useAuth'
import useAuthStore from '../../store/authStore'
import { setTokens } from '../../utils/token'
import { getCartId } from '../../utils/cartId'
import useCartStore from '../../store/cartStore'
import axiosClientAuth from '../../api/axiosClientAuth'
import axiosClient from '../../api/axiosClient'
import { BASE_URL } from '../../api/endpoints'
import './LoginPage.css'

const { Title, Text } = Typography

function LoginPage() {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const location = useLocation()
  const { loginUser, loading, error } = useAuth()
  const { login: storeLogin, setUser } = useAuthStore()
  const { updateCartId } = useCartStore()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const authError = params.get('error')

    if (authError) {
      message.error('Đăng nhập Google thất bại')
      window.history.replaceState({}, '', '/user/login')
    }

    if (code) {
      axiosClient.post('/api/auth/exchange-code', { code })
        .then(res => {
          const { accessToken, refreshToken } = res.data.data
          setTokens({ accessToken, refreshToken })
          storeLogin({ accessToken, refreshToken }, {})

          const cartId = params.get('cartId')
          if (cartId) updateCartId(cartId)

          const redirect = sessionStorage.getItem('loginRedirect') || '/'
          sessionStorage.removeItem('loginRedirect')
          window.history.replaceState({}, '', '/user/login')
          navigate(redirect)

          axiosClientAuth.get('/api/user/info')
            .then(res => setUser(res.data.data.user))
            .catch(() => {})
        })
        .catch(() => {
          message.error('Đăng nhập thất bại')
        })
    }
  }, [navigate, storeLogin, setUser])

  const handleSubmit = async (values) => {
    await loginUser(values.email, values.password)
  }

  const handleGoogleLogin = () => {
    const params = new URLSearchParams(location.search)
    const redirect = params.get('redirect')
    if (redirect) {
      sessionStorage.setItem('loginRedirect', redirect)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Title level={3} className="auth-title">Đăng nhập</Title>

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
            <Input placeholder="example@email.com" size="large" />
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

        <div className="auth-links">
          <Link to="/user/password/forgot">Quên mật khẩu?</Link>
        </div>

        <Divider>Hoặc</Divider>

        <a href={`${BASE_URL}/api/auth/google?origin=${encodeURIComponent(window.location.origin)}${getCartId() ? '&cartId=' + getCartId() : ''}`} className="google-btn" onClick={handleGoogleLogin}>
          <Button icon={<GoogleOutlined />} size="large" block>
            Đăng nhập bằng Google
          </Button>
        </a>

        <div className="auth-footer">
          <Text>Chưa có tài khoản? </Text>
          <Link to="/user/register">Đăng ký ngay</Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
