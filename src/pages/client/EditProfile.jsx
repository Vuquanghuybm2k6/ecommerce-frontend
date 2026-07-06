import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Input, Button, Upload, Typography, Spin, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import useEditProfile from '../../hooks/useEditProfile'
import useAuthStore from '../../store/authStore'
import './EditProfile.css'

const { Title, Text } = Typography

function EditProfile() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { initialValues, loading, saving, error, updateProfile } = useEditProfile()
  const { user } = useAuthStore()
  const [avatarFile, setAvatarFile] = useState(null)

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        fullName: initialValues.fullName,
        email: initialValues.email,
        phone: initialValues.phone || '',
      })
    }
  }, [initialValues, form])

  const handleAvatarChange = (info) => {
    if (info.fileList.length > 0) {
      setAvatarFile(info.fileList[0].originFileObj)
    } else {
      setAvatarFile(null)
    }
  }

  const handleSubmit = async (values) => {
    const formData = new FormData()
    formData.append('fullName', values.fullName)
    formData.append('email', values.email)
    formData.append('password', values.password)
    if (values.phone) formData.append('phone', values.phone)
    if (avatarFile) formData.append('avatar', avatarFile)

    try {
      await updateProfile(formData)
      message.success('Cập nhật thông tin thành công')
      navigate('/user/info')
    } catch {
      // error handled in hook
    }
  }

  if (loading) {
    return <div className="profile-loading"><Spin size="large" /></div>
  }

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-card">
        <Title level={3}>Chỉnh sửa hồ sơ</Title>

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
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input size="large" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
          >
            <Input size="large" placeholder="0912345678" />
          </Form.Item>

          <Form.Item label="Ảnh đại diện">
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
              onChange={handleAvatarChange}
              accept="image/*"
              defaultFileList={
                user?.avatar
                  ? [{ uid: '-1', name: 'avatar', url: user.avatar, status: 'done' }]
                  : []
              }
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu để xác nhận' }]}
            extra="Nhập mật khẩu hiện tại để xác nhận thay đổi"
          >
            <Input.Password size="large" placeholder="••••••••" />
          </Form.Item>

          {error && (
            <Text type="danger" className="auth-error">{error}</Text>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={saving}>
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>

        <div className="auth-footer">
          <Link to="/user/info">Quay lại</Link>
        </div>
      </div>
    </div>
  )
}

export default EditProfile
