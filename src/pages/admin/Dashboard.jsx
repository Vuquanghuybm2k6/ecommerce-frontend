import { Spin, Typography, Card, Row, Col, Statistic } from 'antd'
import {
  ShoppingOutlined,
  AppstoreOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import useDashboard from '../../hooks/useDashboard'
import './Dashboard.css'

const { Title } = Typography

const entityConfig = [
  {
    key: 'categoryProduct',
    title: 'Danh mục sản phẩm',
    icon: <AppstoreOutlined style={{ fontSize: 28, color: '#722ed1' }} />,
    color: '#f9f0ff',
  },
  {
    key: 'product',
    title: 'Sản phẩm',
    icon: <ShoppingOutlined style={{ fontSize: 28, color: '#1677ff' }} />,
    color: '#e6f4ff',
  },
  {
    key: 'account',
    title: 'Tài khoản Admin',
    icon: <TeamOutlined style={{ fontSize: 28, color: '#52c41a' }} />,
    color: '#f6ffed',
  },
  {
    key: 'user',
    title: 'Người dùng',
    icon: <UserOutlined style={{ fontSize: 28, color: '#fa8c16' }} />,
    color: '#fff7e6',
  },
]

function Dashboard() {
  const { statistic, loading, error } = useDashboard()

  if (loading) {
    return <div className="dash-loading"><Spin size="large" /></div>
  }

  if (error) {
    return <Typography.Text type="danger">Không thể tải dữ liệu</Typography.Text>
  }

  return (
    <div className="dashboard-page">
      <Title level={3}>Tổng quan</Title>

      <Row gutter={[24, 24]}>
        {entityConfig.map((entity) => {
          const data = statistic?.[entity.key]
          if (!data) return null

          return (
            <Col xs={24} sm={12} lg={6} key={entity.key}>
              <Card className="dash-card" style={{ background: entity.color }}>
                <div className="dash-card-header">
                  {entity.icon}
                  <Title level={5} style={{ margin: 0 }}>{entity.title}</Title>
                </div>
                <Row gutter={16} className="dash-stats">
                  <Col span={8}>
                    <Statistic title="Tổng" value={data.total} valueStyle={{ fontSize: 22 }} />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Hoạt động"
                      value={data.active}
                      valueStyle={{ fontSize: 22, color: '#52c41a' }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="Ngừng"
                      value={data.inactive}
                      valueStyle={{ fontSize: 22, color: '#ff4d4f' }}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          )
        })}
      </Row>
    </div>
  )
}

export default Dashboard
