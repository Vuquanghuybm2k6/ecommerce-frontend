import { Link } from 'react-router-dom'
import { Typography, Image, Tag, Descriptions, Button, Spin } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import useAdminMyAccount from '../../hooks/useAdminMyAccount'

const { Title } = Typography

function MyAccount() {
  const { user, loading } = useAdminMyAccount()

  if (loading) {
    return <Spin size="large" style={{ display: 'block', marginTop: 80, textAlign: 'center' }} />
  }

  if (!user) {
    return <Typography.Text type="danger">Không thể tải thông tin tài khoản</Typography.Text>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3}>Tài khoản của tôi</Title>
        <Link to="/admin/my-account/edit">
          <Button type="primary" icon={<EditOutlined />}>Chỉnh sửa</Button>
        </Link>
      </div>

      <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
        {user.avatar && (
          <Image
            src={user.avatar}
            alt={user.fullName}
            width={120}
            height={120}
            style={{ objectFit: 'cover', borderRadius: '50%' }}
          />
        )}
        <div style={{ flex: 1 }}>
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="Họ tên" span={2}>{user.fullName}</Descriptions.Item>
            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{user.phone || '—'}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={user.status === 'active' ? 'green' : 'red'}>
                {user.status === 'active' ? 'Hoạt động' : 'Dừng hoạt động'}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </div>
  )
}

export default MyAccount
