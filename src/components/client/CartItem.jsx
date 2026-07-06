import { InputNumber, Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import './CartItem.css'

function CartItem({ item, onDelete, onUpdateQuantity }) {
  const { productInfo, quantity, totalPrice, product_id } = item
  const { title, thumbnail, slug, priceNew, price, discountPercentage } = productInfo || {}
  const hasDiscount = discountPercentage > 0

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
              <span className="current-price">{priceNew?.toLocaleString('vi-VN')}₫</span>
              <span className="old-price">{price?.toLocaleString('vi-VN')}₫</span>
            </>
          ) : (
            <span className="current-price">{price?.toLocaleString('vi-VN')}₫</span>
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
        {totalPrice?.toLocaleString('vi-VN')}₫
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
