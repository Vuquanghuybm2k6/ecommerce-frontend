import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Spin, Result, Typography, Descriptions, Table, Tag, Button, Steps, Modal } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import useOrderDetail from '../../hooks/useOrderDetail'
import { formatCurrency, getDisplayPrice } from '../../utils/price'
import './OrderSuccess.css'

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

const stepMap = {
  pending: 0,
  pending_vnpay: 0,
  payment_failed: 0,
  confirmed: 1,
  shipped: 2,
  delivered: 3,
  cancelled: 0,
}

function OrderDetail() {
  const { orderId } = useParams()
  const { order, loading, error, cancelOrder } = useOrderDetail(orderId)
  const [cancelling, setCancelling] = useState(false)

  if (loading) {
    return <div className="order-loading"><Spin size="large" /></div>
  }

  if (error || !order) {
    return (
      <Result
        status="error"
        title="Không tìm thấy đơn hàng"
        extra={
          <Link to="/user/orders">
            <Button type="primary">Quay lại đơn hàng</Button>
          </Link>
        }
      />
    )
  }

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'productInfo',
      key: 'product',
      render: (info) => (
        <div className="order-product-cell">
          <img src={info?.thumbnail} alt={info?.title} className="order-product-thumb" />
          <span>{info?.title}</span>
        </div>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'priceNew',
      key: 'price',
      render: (val, record) => formatCurrency(val ?? getDisplayPrice(record?.productInfo || record)),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'qty',
    },
    {
      title: 'Thành tiền',
      dataIndex: 'totalPrice',
      key: 'total',
      render: (val) => formatCurrency(val),
    },
  ]

  return (
    <div className="order-success-page">
      <Link to="/user/orders">
        <Button type="link" icon={<ArrowLeftOutlined />} style={{ padding: 0, marginBottom: 16 }}>
          Quay lại đơn hàng
        </Button>
      </Link>

      <div className="order-detail-card">
        <Title level={4}>Thông tin đơn hàng</Title>

        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Mã đơn hàng">
            <Text strong>{order.orderCode}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={statusColorMap[order.status]}>{statusLabelMap[order.status]}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Người nhận">{order.userInfo?.fullName}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{order.userInfo?.phone}</Descriptions.Item>
          <Descriptions.Item label="Địa chỉ" span={2}>{order.userInfo?.address}</Descriptions.Item>
          <Descriptions.Item label="Phương thức thanh toán">
            {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : order.paymentMethod}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày đặt">
            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
          </Descriptions.Item>
        </Descriptions>
      </div>

      <div className="order-detail-card">
        <Title level={4}>Tiến trình đơn hàng</Title>
        <Steps
          current={stepMap[order.status]}
          status={order.status === 'cancelled' ? 'error' : 'process'}
          items={[
            { title: 'Chờ xác nhận' },
            { title: 'Đã xác nhận' },
            { title: 'Đang giao hàng' },
            { title: 'Đã giao hàng' },
          ]}
        />
      </div>

      <div className="order-detail-card">
        <Title level={4}>Chi tiết sản phẩm</Title>
        <Table
          dataSource={order.products}
          columns={columns}
          rowKey={(record) => record.product_id}
          pagination={false}
          summary={() => (
            <Table.Summary>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={3}>
                  <Text strong>Tổng cộng</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  <Text strong className="order-total-price">
                    {formatCurrency(order.totalPrice)}
                  </Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </div>

      <div className="order-actions">
        {order.status === 'pending' && (
          <Button
            danger
            loading={cancelling}
            onClick={() => {
              Modal.confirm({
                title: 'Xác nhận hủy đơn hàng',
                content: `Bạn có chắc muốn hủy đơn hàng "${order.orderCode}"?`,
                okText: 'Hủy đơn',
                cancelText: 'Giữ lại',
                okButtonProps: { danger: true },
                onOk: async () => {
                  setCancelling(true)
                  await cancelOrder()
                  setCancelling(false)
                },
              })
            }}
          >
            Hủy đơn hàng
          </Button>
        )}
        <Link to="/">
          <Button>Tiếp tục mua sắm</Button>
        </Link>
      </div>
    </div>
  )
}

export default OrderDetail
