import { useParams, Link } from 'react-router-dom'
import { Spin, Typography, Descriptions, Table, Tag, Button, Select, Space, Modal } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import useAdminOrderDetail from '../../../hooks/useAdminOrderDetail'
import { formatCurrency, getDisplayPrice } from '../../../utils/price'
import './Detail.css'

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

const VALID_TRANSITIONS = {
  pending:    ["confirmed", "cancelled"],
  confirmed:  ["shipped", "cancelled"],
  shipped:    ["delivered"],
  delivered:  [],
  cancelled:  [],
}

function AdminOrderDetail() {
  const { id: orderId } = useParams()
  const { order, loading, error, changeStatus } = useAdminOrderDetail(orderId)

  if (loading) {
    return <div className="admin-order-loading"><Spin size="large" /></div>
  }

  if (error || !order) {
    return (
      <div className="admin-order-loading">
        <Text type="danger">Không tìm thấy đơn hàng</Text>
      </div>
    )
  }

  const handleStatusChange = (newStatus) => {
    Modal.confirm({
      title: 'Xác nhận đổi trạng thái',
      content: `Chuyển đơn hàng "${order.orderCode}" sang "${statusLabelMap[newStatus]}"?`,
      onOk: () => changeStatus(newStatus),
    })
  }

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'productInfo',
      key: 'product',
      render: (info) => (
        <div className="admin-order-product-cell">
          <img src={info?.thumbnail} alt={info?.title} className="admin-order-product-thumb" />
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
    <div className="admin-order-detail-page">
      <Link to="/admin/orders">
        <Button type="link" icon={<ArrowLeftOutlined />} style={{ padding: 0, marginBottom: 16 }}>
          Quay lại danh sách
        </Button>
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3}>Chi tiết đơn hàng {order.orderCode}</Title>
        <Space>
          <Text strong>Trạng thái:</Text>
          <Select
            value={order.status}
            style={{ width: 160 }}
            onChange={handleStatusChange}
            options={
              [
                { value: order.status, label: statusLabelMap[order.status] },
                ...VALID_TRANSITIONS[order.status]
                  .filter(s => s !== order.status)
                  .map(s => ({ value: s, label: statusLabelMap[s] })),
              ]
            }
          />
        </Space>
      </div>

      <div className="admin-order-card">
        <Title level={5}>Thông tin giao hàng</Title>
        <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
          <Descriptions.Item label="Người nhận">{order.userInfo?.fullName}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{order.userInfo?.phone}</Descriptions.Item>
          <Descriptions.Item label="Địa chỉ" span={2}>{order.userInfo?.address}</Descriptions.Item>
        </Descriptions>
      </div>

      <div className="admin-order-card">
        <Title level={5}>Thông tin đơn hàng</Title>
        <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small">
          <Descriptions.Item label="Mã đơn hàng">
            <Text strong>{order.orderCode}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={statusColorMap[order.status]}>{statusLabelMap[order.status]}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Phương thức thanh toán">
            {order.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng (COD)' : order.paymentMethod}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày đặt">
            {new Date(order.createdAt).toLocaleDateString('vi-VN')}
          </Descriptions.Item>
          <Descriptions.Item label="Cập nhật lần cuối">
            {order.updatedAt ? new Date(order.updatedAt).toLocaleString('vi-VN') : '---'}
          </Descriptions.Item>
        </Descriptions>
      </div>

      <div className="admin-order-card">
        <Title level={5}>Chi tiết sản phẩm</Title>
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
                  <Text strong style={{ color: '#e74c3c', fontSize: 16 }}>
                    {formatCurrency(order.totalPrice)}
                  </Text>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </div>
    </div>
  )
}

export default AdminOrderDetail
