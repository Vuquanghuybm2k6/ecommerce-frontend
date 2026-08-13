import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Spin, Result, Button, Typography, Descriptions, Table, Tag, message } from 'antd'
import useOrderSuccess from '../../hooks/useOrderSuccess'
import axiosClientAuth from '../../api/axiosClientAuth'
import API from '../../api/endpoints'
import { formatCurrency, getDisplayPrice } from '../../utils/price'
import './VnpaySuccess.css'

const { Title, Text } = Typography

function VnpaySuccess() {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const orderId = params.get('orderId') || ''
  const success = params.get('success') === 'true'
  const responseCode = params.get('vnp_ResponseCode') || ''
  const transactionNo = params.get('vnp_TransactionNo') || ''

  const [paying, setPaying] = useState(false)

  const handlePayAgain = async () => {
    if (!orderId) return
    setPaying(true)
    try {
      const res = await axiosClientAuth.post(API.checkoutPayAgain, { orderId })
      if (res.data.data.paymentUrl) {
        window.location.href = res.data.data.paymentUrl
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể thanh toán lại'
      message.error(msg)
    } finally {
      setPaying(false)
    }
  }

  const { order, loading, error } = useOrderSuccess(orderId)

  if (loading) {
    return <div className="order-loading"><Spin size="large" /></div>
  }

  if (!success) {
    return (
      <Result
        status="error"
        title="Thanh toán thất bại"
        subTitle={
          responseCode
            ? `Mã lỗi VNPay: ${responseCode}${order ? ` - Đơn hàng ${order.orderCode}` : ''}`
            : 'Giao dịch không thành công, vui lòng thử lại'
        }
        extra={
          <>
            {orderId && (
              <Button type="primary" loading={paying} onClick={handlePayAgain}>
                Thanh toán lại
              </Button>
            )}
            <Link to="/cart">
              <Button>Quay lại giỏ hàng</Button>
            </Link>
            {orderId && (
              <Link to={`/user/orders/${orderId}`}>
                <Button>Xem đơn hàng</Button>
              </Link>
            )}
          </>
        }
      />
    )
  }

  if (error || !order) {
    return (
      <Result
        status="warning"
        title="Không tìm thấy thông tin đơn hàng"
        subTitle="Giao dịch có thể đã thành công nhưng chưa đồng bộ, vui lòng kiểm tra lại đơn hàng."
        extra={
          <Link to="/user/orders">
            <Button type="primary">Xem danh sách đơn hàng</Button>
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
      <Result
        status="success"
        title="Thanh toán thành công!"
        subTitle={`Đơn hàng ${order.orderCode} đã được thanh toán qua VNPay`}
      />

      <div className="order-detail-card">
        <Title level={4}>Thông tin thanh toán</Title>
        <Descriptions bordered column={{ xs: 1, sm: 2 }}>
          <Descriptions.Item label="Mã giao dịch VNPay">{transactionNo || '—'}</Descriptions.Item>
          <Descriptions.Item label="Mã đơn hàng">
            <Text strong>{order.orderCode}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={statusColorMap[order.status]}>{statusLabelMap[order.status]}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Người nhận">{order.userInfo?.fullName}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{order.userInfo?.phone}</Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">{order.userInfo?.address}</Descriptions.Item>
        </Descriptions>
      </div>

      <div className="order-detail-card">
        <Title level={4}>Chi tiết đơn hàng</Title>
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
        <Link to="/">
          <Button>Tiếp tục mua sắm</Button>
        </Link>
        <Link to={`/user/orders/${orderId}`}>
          <Button type="primary">Xem chi tiết đơn hàng</Button>
        </Link>
      </div>
    </div>
  )
}

export default VnpaySuccess
