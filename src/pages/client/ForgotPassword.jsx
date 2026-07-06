import { useNavigate, Link } from 'react-router-dom'
import { Form, Input, Button, Typography } from 'antd'
import useForgotPassword from '../../hooks/useForgotPassword'
import './ForgotPassword.css'

const { Title, Text } = Typography

function ForgotPassword() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { sendOtp, loading, error } = useForgotPassword()

  const handleSubmit = async (values) => {
    try {
      await sendOtp(values.email)
      navigate(`/user/password/otp?email=${encodeURIComponent(values.email)}`)
    } catch {
      // error handled in hook
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Title level={3} className="auth-title">Quên mật khẩu</Title>
        <Text className="auth-description">
          Nhập email của bạn để nhận mã OTP xác thực
        </Text>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          style={{ marginTop: 24 }}
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

          {error && (
            <Text type="danger" className="auth-error">{error}</Text>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={loading}>
              Gửi mã OTP
            </Button>
          </Form.Item>
        </Form>

        <div className="auth-footer">
          <Link to="/user/login">Quay lại đăng nhập</Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
