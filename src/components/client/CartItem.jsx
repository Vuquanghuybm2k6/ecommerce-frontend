import { InputNumber, Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { formatCurrency, getDisplayPrice } from '../../utils/price'
import './CartItem.css'

function CartItem({ item, onDelete, onUpdateQuantity }) {
  const { productInfo, quantity, totalPrice, product_id, variantSku, variantLabel, variantOptions } = item || {}
  const productData = productInfo || {}
  const title = productData.title || 'Sản phẩm'
  const thumbnail = productData.thumbnail || ''
  const slug = productData.slug || ''
  const price = Number(productData.price) || 0
  const priceNew = Number(productData.priceNew) || 0
  const discountPercentage = Number(productData.discountPercentage) || 0
  const hasDiscount = discountPercentage > 0
  const displayPrice = getDisplayPrice({
    ...productData,
    price,
    priceNew,
    discountPercentage,
  })

  const variantDisplay = variantOptions?.map(opt => `${opt.key}: ${opt.value}`).join(', ')

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <Link to={`/products/detail/${slug}`}>
          <img alt={title} src={thumbnail || null} />
        </Link>
      </div>

      <div className="cart-item-info">
        <Link to={`/products/detail/${slug}`} className="cart-item-name">
          {title}
        </Link>
        {variantLabel && (
          <div className="cart-item-variant">
            {variantLabel}
          </div>
        )}
        {variantDisplay && !variantLabel && (
          <div className="cart-item-variant">
            {variantDisplay}
          </div>
        )}
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
          onChange={(val) => onUpdateQuantity(product_id, val, variantSku)}
        />
      </div>

      <div className="cart-item-total">
        {formatCurrency(totalPrice)}
      </div>

      <Button
        type="text"
        danger
        icon={<DeleteOutlined />}
        onClick={() => onDelete(product_id, variantSku)}
        className="cart-item-delete"
      />
    </div>
  )
}

export default CartItem
