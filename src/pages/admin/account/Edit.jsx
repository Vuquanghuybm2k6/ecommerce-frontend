import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Typography, Form, Input, Select, Upload, Button, Space, Spin } from 'antd'
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import useAdminAccountEdit from '../../../hooks/useAdminAccountEdit'

const { Title } = Typography

function EditAccount() {
  const { id } = useParams()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { account, roles, loading, submitting, updateAccount } = useAdminAccountEdit(id)
  const [fileList, setFileList] = useState([])

  useEffect(() => {
    if (!account) return
    form.setFieldsValue({
      fullName: account.fullName,
      email: account.email,
      phone: account.phone,
      role_id: account.role_id || undefined,
      status: account.status || 'active',
    })
    if (account.avatar) {
      setFileList([{ uid: '-1', name: 'avatar.png', status: 'done', url: account.avatar }])
    }
  }, [account, form])

  const handleSubmit = async (values) => {
    const formData = new FormData()
    formData.append('fullName', values.fullName)
    formData.append('email', values.email)
    formData.append('phone', values.phone || '')
    formData.append('role_id', values.role_id || '')
    formData.append('status', values.status || 'active')
    if (values.password) {
      formData.append('password', values.password)
    }
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('avatar', fileList[0].originFileObj)
    }
    updateAccount(formData)
  }

  if (loading) {
    return <Spin size="large" style={{ display: 'block', marginTop: 80, textAlign: 'center' }} />
  }

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/accounts')}>Quay lại</Button>
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

        <Space style={{ width: '100%' }} size="large">
          <Form.Item name="role_id" label="Nhóm quyền" rules={[{ required: true, message: 'Vui lòng chọn nhóm quyền' }]}>
            <Select style={{ width: 250 }} placeholder="Chọn nhóm quyền">
              {roles.map(role => (
                <Select.Option key={role._id} value={role._id}>{role.title}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="status" label="Trạng thái">
            <Select style={{ width: 200 }}>
              <Select.Option value="active">Hoạt động</Select.Option>
              <Select.Option value="inactive">Dừng hoạt động</Select.Option>
            </Select>
          </Form.Item>
        </Space>

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
          <Button type="primary" htmlType="submit" loading={submitting}>Cập nhật tài khoản</Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default EditAccount
