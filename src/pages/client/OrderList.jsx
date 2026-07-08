import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Spin, Typography, Table, Tag, Button, Select, Empty, Modal, message, Space, Pagination } from 'antd'
import { EyeOutlined, CloseCircleOutlined } from '@ant-design/icons'
import useOrderList from '../../hooks/useOrderList'
import axiosClientAuth from '../../api/axiosClientAuth'
import API from '../../api/endpoints'
import { formatCurrency } from '../../utils/price'
import './OrderList.css'

const { Title, Text } = Typography

const statusColorMap = {
  pending: 'orange',
  pending_vnpay: 'gold',
  payment_failed: 'volcano',
  confirmed: 'blue',
  shipped: 'cyan',
  delivered: 'green',
  cancelled: 'red',
}

const statusLabelMap = {
  pending: 'Chờ xác nhận',
  pending_vnpay: 'Chờ thanh toán VNPay',
  payment_failed: 'Thanh toán thất bại',
  confirmed: 'Đã xác nhận',
  shipped: 'Đang giao hàng',
  delivered: 'Đã giao hàng',
  cancelled: 'Đã hủy',
}

function OrderList() {
  const { orders, loading, error, refetch, page, total, changePage } = useOrderList()
  const [filterStatus, setFilterStatus] = useState('all')

  const handleFilterChange = (value) => {
    setFilterStatus(value)
    changePage(1)
  }

  const handleCancel = (orderId, orderCode) => {
    Modal.confirm({
      title: 'Xác nhận hủy đơn hàng',
      content: `Bạn có chắc muốn hủy đơn hàng "${orderCode}"?`,
      okText: 'Hủy đơn',
      cancelText: 'Giữ lại',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await axiosClientAuth.patch(API.orderCancel(orderId))
          message.success('Hủy đơn hàng thành công')
          refetch()
        } catch (err) {
          message.error(err.response?.data?.message || 'Hủy đơn hàng thất bại')
        }
      },
    })
  }

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
        <Space>
          <Link to={`/user/orders/${record._id}`}>
            <Button type="primary" ghost icon={<EyeOutlined />} size="small">
              Chi tiết
            </Button>
          </Link>
          {record.status === 'pending' && (
            <Button
              danger
              icon={<CloseCircleOutlined />}
              size="small"
              onClick={() => handleCancel(record._id, record.orderCode)}
            >
              Hủy
            </Button>
          )}
        </Space>
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
          onChange={handleFilterChange}
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
          pagination={false}
          locale={{ emptyText: 'Chưa có đơn hàng nào' }}
        />
        {total > 0 && (
          <div className="order-list-pagination">
            <Pagination
              current={page}
              total={total}
              pageSize={10}
              onChange={changePage}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderList
