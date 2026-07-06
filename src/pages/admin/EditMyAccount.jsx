import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Typography, Form, Input, Upload, Button, Space, Spin } from 'antd'
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import useAdminMyAccount from '../../hooks/useAdminMyAccount'

const { Title } = Typography

function EditMyAccount() {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { user, loading, updateProfile } = useAdminMyAccount()
  const [fileList, setFileList] = useState([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!user) return
    form.setFieldsValue({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
    })
    if (user.avatar) {
      setFileList([{ uid: '-1', name: 'avatar.png', status: 'done', url: user.avatar }])
    }
  }, [user, form])

  const handleSubmit = async (values) => {
    setSubmitting(true)
    const formData = new FormData()
    formData.append('fullName', values.fullName)
    formData.append('email', values.email)
    formData.append('phone', values.phone || '')
    if (values.password) {
      formData.append('password', values.password)
    }
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('avatar', fileList[0].originFileObj)
    }
    await updateProfile(formData)
    setSubmitting(false)
    navigate('/admin/my-account')
  }

  if (loading) {
    return <Spin size="large" style={{ display: 'block', marginTop: 80, textAlign: 'center' }} />
  }

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/my-account')}>Quay lại</Button>
      </Space>
      <Title level={3}>Chỉnh sửa tài khoản</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: 600 }}
      >
        <Form.Item name="fullName" label="Họ tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
          <Input placeholder="Nhập họ tên" />
        </Form.Item>

        <Form.Item name="email" label="Email" rules={[
          { required: true, message: 'Vui lòng nhập email' },
          { type: 'email', message: 'Email không hợp lệ' },
        ]}>
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item name="password" label="Mật khẩu" rules={[
          { min: 6, message: 'Mật khẩu ít nhất 6 ký tự' },
        ]}>
          <Input.Password placeholder="Để trống nếu không đổi mật khẩu" />
        </Form.Item>

        <Form.Item name="phone" label="Số điện thoại">
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Form.Item label="Avatar">
          <Upload
            listType="picture-card"
            fileList={fileList}
            beforeUpload={() => false}
            onChange={({ fileList: fl }) => setFileList(fl.slice(-1))}
            maxCount={1}
            accept="image/*"
          >
            {fileList.length < 1 && (
              <div><UploadOutlined /><div style={{ marginTop: 8 }}>Upload</div></div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>Cập nhật</Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default EditMyAccount
