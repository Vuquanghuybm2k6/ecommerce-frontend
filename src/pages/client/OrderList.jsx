import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Spin, Typography, Table, Tag, Button, Select, Empty } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import useOrderList from '../../hooks/useOrderList'
import { formatCurrency } from '../../utils/price'
import './OrderList.css'

const { Title, Text } = Typography

const statusColorMap = {
  pending: 'orange',
  confirmed: 'blue',
  shipped: 'cyan',
  delivered: 'green',
  cancelled: 'red',
}

const statusLabelMap = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipped: 'Đang giao hàng',
  delivered: 'Đã giao hàng',
  cancelled: 'Đã hủy',
}

function OrderList() {
  const { orders, loading, error } = useOrderList()
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(o => o.status === filterStatus)

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderCode',
      key: 'orderCode',
      render: (val) => <Text strong>{val}</Text>,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (val) => new Date(val).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Số lượng',
      key: 'qty',
      render: (_, record) => record.products.reduce((sum, p) => sum + p.quantity, 0),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (val) => <Text strong>{formatCurrency(val)}</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={statusColorMap[status]}>{statusLabelMap[status]}</Tag>,
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Link to={`/user/orders/${record._id}`}>
          <Button type="primary" ghost icon={<EyeOutlined />} size="small">
            Chi tiết
          </Button>
        </Link>
      ),
    },
  ]

  if (loading) {
    return <div className="order-list-loading"><Spin size="large" /></div>
  }

  if (error) {
    return (
      <div className="order-list-loading">
        <Empty description="Không thể tải danh sách đơn hàng" />
      </div>
    )
  }

  return (
    <div className="order-list-page">
      <div className="order-list-header">
        <Title level={3}>Đơn hàng của tôi</Title>
        <Select
          value={filterStatus}
          onChange={setFilterStatus}
          style={{ width: 180 }}
          options={[
            { value: 'all', label: 'Tất cả' },
            { value: 'pending', label: 'Chờ xác nhận' },
            { value: 'confirmed', label: 'Đã xác nhận' },
            { value: 'shipped', label: 'Đang giao hàng' },
            { value: 'delivered', label: 'Đã giao hàng' },
            { value: 'cancelled', label: 'Đã hủy' },
          ]}
        />
      </div>

      <div className="order-list-table">
        <Table
          dataSource={filteredOrders}
          columns={columns}
          rowKey={(record) => record._id}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: 'Chưa có đơn hàng nào' }}
        />
      </div>
    </div>
  )
}

export default OrderList
