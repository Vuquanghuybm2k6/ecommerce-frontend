import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Form, Input, Select, Button, Spin, Empty, Typography, Divider, message,
} from 'antd'
import useCheckout from '../../hooks/useCheckout'
import usePlaceOrder from '../../hooks/usePlaceOrder'
import useAuthStore from '../../store/authStore'
import { getCartId } from '../../utils/cartId'
import './CheckoutPage.css'

const { Title, Text } = Typography
const { TextArea } = Input

function CheckoutPage() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { cartDetail, loading } = useCheckout()
  const { placeOrder, placing, error: placeError } = usePlaceOrder()
  const { isAuthenticated } = useAuthStore()
  const [submitted, setSubmitted] = useState(false)
  const hasCartId = !!getCartId()

  const items = cartDetail?.products || []
  const isEmpty = !hasCartId || items.length === 0

  useEffect(() => {
    if (placeError && submitted) {
      message.error(placeError)
      setSubmitted(false)
    }
  }, [placeError, submitted])

  const handleSubmit = async (values) => {
    if (!isAuthenticated) {
      const redirect = encodeURIComponent('/checkout')
      navigate(`/user/login?redirect=${redirect}`)
      return
    }
    setSubmitted(true)
    try {
      const { orderId } = await placeOrder(values)
      navigate(`/checkout/success/${orderId}`)
    } catch {
      setSubmitted(false)
    }
  }

  if (loading) {
    return <div className="checkout-loading"><Spin size="large" /></div>
  }

  if (isEmpty) {
    return (
      <div className="checkout-empty">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Giỏ hàng trống, vui lòng thêm sản phẩm trước khi thanh toán"
        >
          <Link to="/cart">
            <Button type="primary">Quay lại giỏ hàng</Button>
          </Link>
        </Empty>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <Title level={2}>Thanh toán</Title>

      <div className="checkout-layout">
        <div className="checkout-form-section">
          <Title level={4}>Thông tin giao hàng</Title>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Form.Item
              name="fullName"
              label="Họ và tên"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
            >
              <Input placeholder="Nguyễn Văn A" size="large" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại' },
                {
                  pattern: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,
                  message: 'Số điện thoại không hợp lệ',
                },
              ]}
            >
              <Input placeholder="0912345678" size="large" />
            </Form.Item>

            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
            >
              <TextArea
                placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                rows={3}
                size="large"
              />
            </Form.Item>

            <Form.Item name="paymentMethod" label="Phương thức thanh toán">
              <Select size="large" defaultValue="COD">
                <Select.Option value="COD">Thanh toán khi nhận hàng (COD)</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="shippingMethod" label="Phương thức vận chuyển">
              <Select size="large" defaultValue="">
                <Select.Option value="">Giao hàng tiêu chuẩn</Select.Option>
              </Select>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={placing}
              block
            >
              Đặt hàng
            </Button>
          </Form>
        </div>

        <div className="checkout-summary-section">
          <Title level={4}>Đơn hàng ({items.length} sản phẩm)</Title>

          <div className="checkout-products">
            {items.map((item) => {
              const info = item.productInfo || {}
              return (
                <div key={item.product_id} className="checkout-product-item">
                  <div className="checkout-product-image">
                    <img alt={info.title} src={info.thumbnail} />
                  </div>
                  <div className="checkout-product-info">
                    <Text className="checkout-product-name">{info.title}</Text>
                    <Text className="checkout-product-meta">
                      {info.priceNew?.toLocaleString('vi-VN')}₫ x {item.quantity}
                    </Text>
                  </div>
                  <div className="checkout-product-total">
                    {item.totalPrice?.toLocaleString('vi-VN')}₫
                  </div>
                </div>
              )
            })}
          </div>

          <Divider />

          <div className="checkout-total">
            <Text className="checkout-total-label">Tổng cộng</Text>
            <Text className="checkout-total-price">
              {cartDetail.totalPrice?.toLocaleString('vi-VN')}₫
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
