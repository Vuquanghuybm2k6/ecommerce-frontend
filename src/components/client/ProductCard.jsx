import { Link } from 'react-router-dom'
import { Card, Tag } from 'antd'
import { highlightText } from '../../utils/highlight.jsx'
import { formatCurrency, getDisplayPrice } from '../../utils/price'
import './ProductCard.css'

const { Meta } = Card

function ProductCard({ product, highlightKeyword }) {
  const { title, price, discountPercentage, priceNew, thumbnail, slug } = product
  const hasDiscount = discountPercentage > 0
  const displayPrice = getDisplayPrice(product)

  return (
    <Link to={`/products/detail/${slug}`} className="product-card-link">
      <Card
        hoverable
        className="product-card"
        cover={
          <div className="product-card-image">
            <img alt={title} src={thumbnail} />
            {hasDiscount && (
              <Tag color="red" className="discount-tag">
                -{discountPercentage}%
              </Tag>
            )}
          </div>
        }
      >
        <Meta
          title={<span className="product-card-title">{highlightText(title, highlightKeyword)}</span>}
          description={
            <div className="product-card-prices">
              {hasDiscount ? (
                <>
                  <span className="product-price-new">
                    {formatCurrency(displayPrice)}
                  </span>
                  <span className="product-price-old">
                    {formatCurrency(price)}
                  </span>
                </>
              ) : (
                <span className="product-price">
                  {formatCurrency(price)}
                </span>
              )}
            </div>
          }
        />
      </Card>
    </Link>
  )
}

export default ProductCard
