import { Link } from 'react-router-dom'
import { Card, Tag } from 'antd'
import './ProductCard.css'

const { Meta } = Card

function ProductCard({ product }) {
  const { title, price, discountPercentage, priceNew, thumbnail, slug } = product
  const hasDiscount = discountPercentage > 0

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
          title={<span className="product-card-title">{title}</span>}
          description={
            <div className="product-card-prices">
              {hasDiscount ? (
                <>
                  <span className="product-price-new">
                    {priceNew?.toLocaleString('vi-VN')}₫
                  </span>
                  <span className="product-price-old">
                    {price?.toLocaleString('vi-VN')}₫
                  </span>
                </>
              ) : (
                <span className="product-price">
                  {price?.toLocaleString('vi-VN')}₫
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
