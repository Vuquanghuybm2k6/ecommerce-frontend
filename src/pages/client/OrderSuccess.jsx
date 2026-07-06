import { useParams, Link } from 'react-router-dom'
import { Spin, Result, Typography, Descriptions, Table, Tag, Button } from 'antd'
import useOrderSuccess from '../../hooks/useOrderSuccess'
import './OrderSuccess.css'

const { Title, Text } = Typography

function OrderSuccess() {
  const { orderId } = useParams()
  const { order, loading, error } = useOrderSuccess(orderId)

  if (loading) {
    return <div className="order-loading"><Spin size="large" /></div>
  }

  if (error || !order) {
    return (
      <Result
        status="error"
        title="Không tìm thấy đơn hàng"
        extra={
          <Link to="/">
            <Button type="primary">Về trang chủ</Button>
          </Link>
        }
      />
    )
  }

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
      render: (val) => `${val?.toLocaleString('vi-VN')}₫`,
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
      render: (val) => `${val?.toLocaleString('vi-VN')}₫`,
    },
  ]

  return (
    <div className="order-success-page">
      <Result
        status="success"
        title="Đặt hàng thành công!"
        subTitle={`Mã đơn hàng: ${order.orderCode}`}
      />

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
                    {order.totalPrice?.toLocaleString('vi-VN')}₫
                  </Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </div>

      <div className="order-actions">
        <Link to="/">
          <Button>Tiếp tục mua sắm</Button>
        </Link>
      </div>
    </div>
  )
}

export default OrderSuccess
