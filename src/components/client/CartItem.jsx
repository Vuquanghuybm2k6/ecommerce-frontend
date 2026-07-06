import { InputNumber, Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { formatCurrency, getDisplayPrice } from '../../utils/price'
import './CartItem.css'

function CartItem({ item, onDelete, onUpdateQuantity }) {
  const { productInfo, quantity, totalPrice, product_id } = item
  const { title, thumbnail, slug, priceNew, price, discountPercentage } = productInfo || {}
  const hasDiscount = discountPercentage > 0
  const displayPrice = getDisplayPrice(productInfo || {})

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <Link to={`/products/detail/${slug}`}>
          <img alt={title} src={thumbnail} />
        </Link>
      </div>

      <div className="cart-item-info">
        <Link to={`/products/detail/${slug}`} className="cart-item-name">
          {title}
        </Link>
        <div className="cart-item-price">
          {hasDiscount ? (
            <>
              <span className="current-price">{formatCurrency(displayPrice)}</span>
              <span className="old-price">{formatCurrency(price)}</span>
            </>
          ) : (
            <span className="current-price">{formatCurrency(price)}</span>
          )}
        </div>
      </div>

      <div className="cart-item-quantity">
        <InputNumber
          min={1}
          value={quantity}
          onChange={(val) => onUpdateQuantity(product_id, val)}
        />
      </div>

      <div className="cart-item-total">
        {formatCurrency(totalPrice)}
      </div>

      <Button
        type="text"
        danger
        icon={<DeleteOutlined />}
        onClick={() => onDelete(product_id)}
        className="cart-item-delete"
      />
    </div>
  )
}

export default CartItem
