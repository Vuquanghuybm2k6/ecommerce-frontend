import { Link } from 'react-router-dom'
import { Spin, Empty, Typography, Button, Divider } from 'antd'
import useCart from '../../hooks/useCart'
import { getCartId } from '../../utils/cartId'
import CartItem from '../../components/client/CartItem'
import { formatCurrency } from '../../utils/price'
import './CartPage.css'

const { Title, Text } = Typography

function CartPage() {
  const { cart, loading, error, deleteItem, updateQuantity } = useCart()
  const hasCartId = !!getCartId()
  const items = cart?.products || []

  if (loading) {
    return <div className="cart-loading"><Spin size="large" /></div>
  }

  if (error) {
    return (
      <div className="cart-empty-state">
        <Empty description="Không thể tải giỏ hàng" />
      </div>
    )
  }

  if (!hasCartId || items.length === 0) {
    return (
      <div className="cart-empty-state">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Giỏ hàng của bạn đang trống"
        >
          <Link to="/products">
            <Button type="primary">Mua sắm ngay</Button>
          </Link>
        </Empty>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <Title level={2}>Giỏ hàng</Title>
      <Text className="cart-count">
        {items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm
      </Text>

      <div className="cart-items">
        <div className="cart-header-row">
          <span className="cart-header-product">Sản phẩm</span>
          <span className="cart-header-qty">Số lượng</span>
          <span className="cart-header-total">Thành tiền</span>
          <span className="cart-header-action" />
        </div>

        <Divider style={{ margin: '8px 0' }} />

        {items.map((item) => (
          <CartItem
            key={item.product_id}
            item={item}
            onDelete={deleteItem}
            onUpdateQuantity={updateQuantity}
          />
        ))}
      </div>

      <Divider />

      <div className="cart-summary">
        <div className="cart-summary-left">
          <Text>Tổng cộng ({items.length} sản phẩm):</Text>
        </div>
        <div className="cart-summary-right">
          <Text className="cart-total-price">
            {formatCurrency(cart.totalPrice)}
          </Text>
          <Link to="/checkout">
            <Button type="primary" size="large">
              Tiến hành thanh toán
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CartPage
