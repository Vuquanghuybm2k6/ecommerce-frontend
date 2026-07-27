import { useEffect, useMemo } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown, Space, Typography } from 'antd'
import {
  DashboardOutlined,
  ShoppingOutlined,
  OrderedListOutlined,
  TeamOutlined,
  UserOutlined,
  SafetyOutlined,
  SettingOutlined,
  LogoutOutlined,
  StarOutlined,
} from '@ant-design/icons'
import useAdminAuthStore from '../../store/adminAuthStore'
import './AdminLayout.css'

const { Header, Sider, Content } = Layout
const { Text } = Typography

function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, isInitialized, initialize, fetchUser, logout } = useAdminAuthStore()
  const permissions = user?.role?.permissions || []
  const isSuperAdmin = user?.role?.title === 'Super Admin'
  const isLoading = isInitialized && !user

  const hasPermission = (key) => {
    if (isSuperAdmin) return true
    return permissions.includes(key)
  }

  const shouldShowItem = (item) => {
    if (item.key === '/admin' || item.key === '/admin/my-account') return true
    if (item.children) {
      const perms = {
        products: ['products_view', 'category_view'],
        orders: ['orders_view'],
        reviews: ['reviews_view'],
        roles: ['roles_view', 'roles_permissions'],
        accounts: ['accounts_view'],
      }
      return perms[item.key]?.some(hasPermission) ?? true
    }
    if (item.key === '/admin/settings/general') return hasPermission('settings_view')
    return true
  }

  const menuItems = useMemo(() => {
    const allItems = [
      { key: '/admin', icon: <DashboardOutlined />, label: <Link to="/admin">Dashboard</Link> },
      {
        key: 'products',
        icon: <ShoppingOutlined />,
        label: 'Sản phẩm',
        children: [
          { key: '/admin/products', label: <Link to="/admin/products">Sản phẩm</Link> },
          { key: '/admin/products-category', label: <Link to="/admin/products-category">Danh mục</Link> },
        ],
      },
      {
        key: 'orders',
        icon: <OrderedListOutlined />,
        label: 'Đơn hàng',
        children: [
          { key: '/admin/orders', label: <Link to="/admin/orders">Danh sách</Link> },
        ],
      },
      {
        key: 'reviews',
        icon: <StarOutlined />,
        label: 'Đánh giá',
        children: [
          { key: '/admin/reviews', label: <Link to="/admin/reviews">Danh sách</Link> },
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

    return allItems.filter(item => shouldShowItem(item))
  }, [permissions, isSuperAdmin])

  useEffect(() => {
    if (!isInitialized) initialize()
  }, [isInitialized])

  useEffect(() => {
    if (isInitialized && isAuthenticated && !user) {
      fetchUser()
    }
  }, [isInitialized, isAuthenticated, user])

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      navigate('/admin/login')
    }
  }, [isInitialized, isAuthenticated, navigate])

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
          defaultOpenKeys={['products', 'orders', 'reviews', 'roles', 'accounts']}
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
