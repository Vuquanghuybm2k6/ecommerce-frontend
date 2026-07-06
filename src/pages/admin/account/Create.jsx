import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Typography, Form, Input, Select, Upload, Button, Space } from 'antd'
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import useAdminAccountCreate from '../../../hooks/useAdminAccountCreate'

const { Title } = Typography

function CreateAccount() {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { roles, loading, submitting, createAccount } = useAdminAccountCreate()
  const [fileList, setFileList] = useState([])

  const handleSubmit = async (values) => {
    const formData = new FormData()
    formData.append('fullName', values.fullName)
    formData.append('email', values.email)
    formData.append('password', values.password)
    formData.append('phone', values.phone || '')
    formData.append('role_id', values.role_id || '')
    formData.append('status', values.status || 'active')
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('avatar', fileList[0].originFileObj)
    }
    createAccount(formData)
  }

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/accounts')}>Quay lại</Button>
      </Space>
      <Title level={3}>Thêm mới tài khoản</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: 600 }}
        initialValues={{ status: 'active' }}
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
          { required: true, message: 'Vui lòng nhập mật khẩu' },
          { min: 6, message: 'Mật khẩu ít nhất 6 ký tự' },
        ]}>
          <Input.Password placeholder="Nhập mật khẩu" />
        </Form.Item>

        <Form.Item name="phone" label="Số điện thoại">
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>

        <Space style={{ width: '100%' }} size="large">
          <Form.Item name="role_id" label="Nhóm quyền" rules={[{ required: true, message: 'Vui lòng chọn nhóm quyền' }]}>
            <Select style={{ width: 250 }} placeholder="Chọn nhóm quyền" loading={loading}>
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
          <Button type="primary" htmlType="submit" loading={submitting}>Tạo tài khoản</Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default CreateAccount
