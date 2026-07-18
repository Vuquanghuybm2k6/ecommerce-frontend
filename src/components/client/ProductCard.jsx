import { Link } from 'react-router-dom'
import { Card, Tag, Rate } from 'antd'
import { highlightText } from '../../utils/highlight.jsx'
import { formatCurrency, getDisplayPrice } from '../../utils/price'
import './ProductCard.css'

const { Meta } = Card

function ProductCard({ product, highlightKeyword }) {
  const { title, priceNew, slug, ratingAvg, ratingCount } = product
  const v = product.variants?.[0]
  const variantPrice = v?.price || 0
  const variantDiscount = v?.discountPercentage || 0
  const thumbnail = v?.thumbnail || ''
  const hasDiscount = variantDiscount > 0
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
                -{variantDiscount}%
              </Tag>
            )}
          </div>
        }
      >
        <Meta
          title={<span className="product-card-title">{highlightText(title, highlightKeyword)}</span>}
          description={
            <>
              <div className="product-card-prices">
                {hasDiscount ? (
                  <>
                    <span className="product-price-new">
                      {formatCurrency(displayPrice)}
                    </span>
                    <span className="product-price-old">
                      {formatCurrency(variantPrice)}
                    </span>
                  </>
                ) : (
                  <span className="product-price">
                    {formatCurrency(variantPrice)}
                  </span>
                )}
              </div>
              {ratingCount > 0 && (
                <div className="product-card-rating">
                  <Rate disabled value={ratingAvg} allowHalf style={{ fontSize: 12 }} />
                  <span className="product-card-rating-count">({ratingCount})</span>
                </div>
              )}
            </>
          }
        />
      </Card>
    </Link>
  )
}

export default ProductCard
