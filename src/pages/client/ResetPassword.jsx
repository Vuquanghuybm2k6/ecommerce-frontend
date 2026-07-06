import { useNavigate, Link } from 'react-router-dom'
import { Form, Input, Button, Typography, message } from 'antd'
import useResetPassword from '../../hooks/useResetPassword'
import './ResetPassword.css'

const { Title, Text } = Typography

function ResetPassword() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { resetPassword, loading, error } = useResetPassword()

  const handleSubmit = async (values) => {
    try {
      await resetPassword(values.password, values.confirmPassword)
      message.success('Đổi mật khẩu thành công. Vui lòng đăng nhập lại.')
      navigate('/user/login')
    } catch {
      // error handled in hook
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Title level={3} className="auth-title">Đặt lại mật khẩu</Title>
        <Text className="auth-description">
          Nhập mật khẩu mới cho tài khoản của bạn
        </Text>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          style={{ marginTop: 24 }}
        >
          <Form.Item
            name="password"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu' },
              { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
            ]}
          >
            <Input.Password placeholder="••••••••" size="large" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Mật khẩu không khớp'))
                },
              }),
            ]}
          >
            <Input.Password placeholder="••••••••" size="large" />
          </Form.Item>

          {error && (
            <Text type="danger" className="auth-error">{error}</Text>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={loading}>
              Đặt lại mật khẩu
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

export default ResetPassword
