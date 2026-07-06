import { Link } from 'react-router-dom'
import { Spin, Typography, Descriptions, Avatar, Button, Tag } from 'antd'
import { UserOutlined, EditOutlined } from '@ant-design/icons'
import useUserInfo from '../../hooks/useUserInfo'
import useAuthStore from '../../store/authStore'
import './UserInfo.css'

const { Title } = Typography

function UserInfo() {
  const { loading, error } = useUserInfo()
  const { user, isAuthenticated } = useAuthStore()

  if (loading) {
    return <div className="profile-loading"><Spin size="large" /></div>
  }

  if (error || !isAuthenticated || !user) {
    return (
      <div className="profile-loading">
        <Typography.Text type="danger">Vui lòng đăng nhập để xem thông tin</Typography.Text>
        <br />
        <Link to="/user/login"><Button type="primary" style={{ marginTop: 16 }}>Đăng nhập</Button></Link>
      </div>
    )
  }

  return (
    <div className="user-info-page">
      <div className="profile-header">
        <Avatar size={96} icon={<UserOutlined />} src={user.avatar} />
        <div className="profile-header-info">
          <Title level={3} style={{ margin: 0 }}>{user.fullName}</Title>
          <Tag color={user.status === 'active' ? 'green' : 'red'}>
            {user.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
          </Tag>
        </div>
        <Link to="/user/edit">
          <Button icon={<EditOutlined />}>Chỉnh sửa hồ sơ</Button>
        </Link>
      </div>

      <div className="profile-detail-card">
        <Title level={4}>Thông tin cá nhân</Title>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Họ và tên">{user.fullName}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{user.phone || 'Chưa cập nhật'}</Descriptions.Item>
          <Descriptions.Item label="Phương thức đăng nhập">
            {user.authType === 'google' ? 'Google' : 'Email / Mật khẩu'}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tham gia">
            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '---'}
          </Descriptions.Item>
        </Descriptions>
      </div>
    </div>
  )
}

export default UserInfo
