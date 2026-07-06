import { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Layout, Input, Badge, Dropdown, Avatar, Button, Space, Typography } from 'antd'
import {
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons'
import useAuthStore from '../../store/authStore'
import useCartStore from '../../store/cartStore'
import './ClientLayout.css'

const { Header, Footer, Content } = Layout
const { Text } = Typography

function ClientLayout() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const { totalQuantity } = useCartStore()
  const [keyword, setKeyword] = useState('')

  const handleSearch = (value) => {
    if (value.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(value.trim())}`)
      setKeyword('')
    }
  }

  const userMenuItems = [
    { key: 'info', label: <Link to="/user/info">Thông tin tài khoản</Link> },
    { key: 'edit', label: <Link to="/user/edit">Chỉnh sửa hồ sơ</Link> },
    { key: 'orders', label: <Link to="/user/orders">Đơn hàng của tôi</Link> },
    { type: 'divider' },
    { key: 'logout', label: <Link to="/user/logout">Đăng xuất</Link> },
  ]

  return (
    <Layout>
      <Header className="client-header">
        <div className="header-inner">
          <Link to="/" className="logo">
            <Text strong style={{ fontSize: 20, color: '#fff' }}>Shop</Text>
          </Link>

          <nav className="nav-links">
            <Link to="/">Trang chủ</Link>
            <Link to="/products">Sản phẩm</Link>
          </nav>

          <Input.Search
            placeholder="Tìm kiếm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onSearch={handleSearch}
            className="search-bar"
          />

          <Space size="middle">
            <Link to="/cart">
              <Badge count={totalQuantity} showZero={false}>
                <ShoppingCartOutlined style={{ fontSize: 22, color: '#fff' }} />
              </Badge>
            </Link>

            {isAuthenticated ? (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Space style={{ cursor: 'pointer', color: '#fff' }}>
                  <Avatar icon={<UserOutlined />} src={user?.avatar} />
                  <span>{user?.fullName || 'User'}</span>
                </Space>
              </Dropdown>
            ) : (
              <Space>
                <Link to="/user/login">
                  <Button type="primary" ghost>Đăng nhập</Button>
                </Link>
                <Link to="/user/register">
                  <Button type="primary">Đăng ký</Button>
                </Link>
              </Space>
            )}
          </Space>
        </div>
      </Header>

      <Content className="client-content">
        <Outlet />
      </Content>

      <Footer className="client-footer">
        <Text>© {new Date().getFullYear()} Shop. Tất cả quyền được bảo lưu.</Text>
      </Footer>
    </Layout>
  )
}

export default ClientLayout
