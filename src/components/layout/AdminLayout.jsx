import { useEffect } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown, Space, Typography } from 'antd'
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  TeamOutlined,
  UserOutlined,
  SafetyOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import useAdminAuthStore from '../../store/adminAuthStore'
import './AdminLayout.css'

const { Header, Sider, Content } = Layout
const { Text } = Typography

const menuItems = [
  { key: '/admin', icon: <DashboardOutlined />, label: <Link to="/admin">Dashboard</Link> },
  {
    key: 'products',
    icon: <ShoppingOutlined />,
    label: 'Sản phẩm',
    children: [
      { key: '/admin/products', label: <Link to="/admin/products">Danh sách</Link> },
      { key: '/admin/products/create', label: <Link to="/admin/products/create">Thêm mới</Link> },
    ],
  },
  {
    key: 'categories',
    icon: <AppstoreOutlined />,
    label: 'Danh mục',
    children: [
      { key: '/admin/products-category', label: <Link to="/admin/products-category">Danh sách</Link> },
      { key: '/admin/products-category/create', label: <Link to="/admin/products-category/create">Thêm mới</Link> },
    ],
  },
  {
    key: 'roles',
    icon: <SafetyOutlined />,
    label: 'Nhóm quyền',
    children: [
      { key: '/admin/roles', label: <Link to="/admin/roles">Danh sách</Link> },
      { key: '/admin/roles/create', label: <Link to="/admin/roles/create">Thêm mới</Link> },
      { key: '/admin/roles/permissions', label: <Link to="/admin/roles/permissions">Phân quyền</Link> },
    ],
  },
  {
    key: 'accounts',
    icon: <TeamOutlined />,
    label: 'Tài khoản',
    children: [
      { key: '/admin/accounts', label: <Link to="/admin/accounts">Danh sách</Link> },
      { key: '/admin/accounts/create', label: <Link to="/admin/accounts/create">Thêm mới</Link> },
    ],
  },
  { key: '/admin/my-account', icon: <UserOutlined />, label: <Link to="/admin/my-account">Tài khoản của tôi</Link> },
  { key: '/admin/settings/general', icon: <SettingOutlined />, label: <Link to="/admin/settings/general">Cài đặt</Link> },
]

function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAdminAuthStore()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login')
    }
  }, [isAuthenticated, navigate])

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const userMenuItems = [
    { key: 'my-account', icon: <UserOutlined />, label: <Link to="/admin/my-account">Tài khoản của tôi</Link> },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất', onClick: handleLogout },
  ]

  const selectedKey = location.pathname

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div className="admin-logo">
          <Text strong style={{ color: '#fff', fontSize: 18 }}>Admin</Text>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={['products', 'categories', 'roles', 'accounts']}
          items={menuItems}
        />
      </Sider>

      <Layout>
        <Header className="admin-header">
          <Space style={{ justifyContent: 'flex-end', width: '100%' }}>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ cursor: 'pointer', color: '#fff' }}>
                <Avatar icon={<UserOutlined />} src={user?.avatar} />
                <span>{user?.fullName || 'Admin'}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content className="admin-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default AdminLayout
