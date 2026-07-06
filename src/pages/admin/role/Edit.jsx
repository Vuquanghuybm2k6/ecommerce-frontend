import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Typography, Form, Input, Button, Space, Spin } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import useAdminRoleEdit from '../../../hooks/useAdminRoleEdit'

const { Title } = Typography
const { TextArea } = Input

function EditRole() {
  const { id } = useParams()
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { role, loading, submitting, updateRole } = useAdminRoleEdit(id)

  useEffect(() => {
    if (!role) return
    form.setFieldsValue({
      title: role.title,
      description: role.description,
    })
  }, [role, form])

  const handleSubmit = (values) => {
    updateRole(values)
  }

  if (loading) {
    return <Spin size="large" style={{ display: 'block', marginTop: 80, textAlign: 'center' }} />
  }

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/roles')}>Quay lại</Button>
      </Space>
      <Title level={3}>Chỉnh sửa nhóm quyền</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ maxWidth: 600 }}
      >
        <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
          <Input placeholder="Nhập tiêu đề nhóm quyền" />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <TextArea rows={4} placeholder="Nhập mô tả nhóm quyền" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>Cập nhật nhóm quyền</Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default EditRole
