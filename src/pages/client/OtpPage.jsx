import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Form, Input, Button, Typography, message } from 'antd'
import useVerifyOtp from '../../hooks/useVerifyOtp'
import './OtpPage.css'

const { Title, Text } = Typography

function OtpPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [form] = Form.useForm()
  const email = searchParams.get('email') || ''
  const { verifyOtp, loading, error } = useVerifyOtp()

  const handleSubmit = async (values) => {
    try {
      await verifyOtp(email, values.otp)
      message.success('Xác thực OTP thành công')
      navigate('/user/password/reset')
    } catch {
      // error handled in hook
    }
  }

  if (!email) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <Title level={3} className="auth-title">Liên kết không hợp lệ</Title>
          <Text>Vui lòng thực hiện lại quy trình quên mật khẩu</Text>
          <div className="auth-footer" style={{ marginTop: 16 }}>
            <Link to="/user/password/forgot">Quay lại</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Title level={3} className="auth-title">Xác thực OTP</Title>
        <Text className="auth-description">
          Mã OTP đã được gửi qua email <b>{email}</b>
        </Text>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          style={{ marginTop: 24 }}
        >
          <Form.Item
            name="otp"
            label="Mã OTP"
            rules={[
              { required: true, message: 'Vui lòng nhập mã OTP' },
              { len: 6, message: 'Mã OTP gồm 6 chữ số' },
            ]}
          >
            <Input.OTP
              size="large"
              length={6}
              style={{ width: '100%', justifyContent: 'center' }}
            />
          </Form.Item>

          {error && (
            <Text type="danger" className="auth-error">{error}</Text>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={loading}>
              Xác thực
            </Button>
          </Form.Item>
        </Form>

        <div className="auth-footer">
          <Link to={`/user/password/forgot`}>Gửi lại mã OTP</Link>
        </div>
      </div>
    </div>
  )
}

export default OtpPage
