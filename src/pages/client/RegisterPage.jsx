import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Input, Button, Upload, Typography } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import useAuth from '../../hooks/useAuth'
import './RegisterPage.css'

const { Title, Text } = Typography

function RegisterPage() {
  const [form] = Form.useForm()
  const { registerUser, loading, error } = useAuth()
  const [avatarFile, setAvatarFile] = useState(null)

  const handleAvatarChange = (info) => {
    if (info.fileList.length > 0) {
      setAvatarFile(info.fileList[0].originFileObj)
    } else {
      setAvatarFile(null)
    }
  }

  const handleSubmit = async (values) => {
    await registerUser({
      fullName: values.fullName,
      email: values.email,
      password: values.password,
      avatar: avatarFile,
    })
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Title level={3} className="auth-title">Đăng ký tài khoản</Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input placeholder="Nguyễn Văn A" size="large" />
          </Form.Item>

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

          <Form.Item label="Ảnh đại diện">
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
              onChange={handleAvatarChange}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>

          {error && (
            <Text type="danger" className="auth-error">{error}</Text>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={loading}>
              Đăng ký
            </Button>
          </Form.Item>
        </Form>

        <div className="auth-footer">
          <Text>Đã có tài khoản? </Text>
          <Link to="/user/login">Đăng nhập</Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
