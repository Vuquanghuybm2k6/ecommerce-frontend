import { useNavigate } from 'react-router-dom'
import { Typography, Form, Input, Button, Space } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import useAdminRoleCreate from '../../../hooks/useAdminRoleCreate'

const { Title } = Typography
const { TextArea } = Input

function CreateRole() {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { submitting, createRole } = useAdminRoleCreate()

  const handleSubmit = (values) => {
    createRole(values)
  }

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/roles')}>Quay lại</Button>
      </Space>
      <Title level={3}>Thêm mới nhóm quyền</Title>

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
          <Button type="primary" htmlType="submit" loading={submitting}>Tạo nhóm quyền</Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default CreateRole
