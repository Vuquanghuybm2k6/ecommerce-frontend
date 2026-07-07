import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Spin, Typography, Button, InputNumber, Breadcrumb, Tag, Divider, notification } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import axiosClient from '../../api/axiosClient'
import API from '../../api/endpoints'
import useProductDetail from '../../hooks/useProductDetail'
import useCartStore from '../../store/cartStore'
import { formatCurrency, getDisplayPrice } from '../../utils/price'
import './ProductDetail.css'

const { Title, Text } = Typography

function ProductDetail() {
  const { slug } = useParams()
  const { product, loading, error } = useProductDetail(slug)
  const { updateCartId, setTotalQuantity } = useCartStore()
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)

  const handleAddToCart = async () => {
    if (!product) return
    setAdding(true)

    try {
      const res = await axiosClient.post(API.cartAdd(product._id), { quantity })
      const updatedCart = res.data.data.cart
      updateCartId(updatedCart._id)
      const totalQty = updatedCart.products.reduce((sum, item) => sum + item.quantity, 0)
      setTotalQuantity(totalQty)
      notification.success({ message: 'Thông báo', description: 'Đã thêm vào giỏ hàng', placement: 'topRight', duration: 3 })
    } catch {
      notification.error({ message: 'Thông báo', description: 'Thêm giỏ hàng thất bại', placement: 'topRight', duration: 3 })
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return <div className="detail-loading"><Spin size="large" /></div>
  }

  if (error || !product) {
    return (
      <div className="detail-error">
        <Title level={3}>Không tìm thấy sản phẩm</Title>
        <Link to="/products">Quay lại danh sách sản phẩm</Link>
      </div>
    )
  }

  const {
    title,
    price,
    discountPercentage,
    priceNew,
    stock,
    thumbnail,
    description,
    category,
  } = product

  const hasDiscount = discountPercentage > 0
  const inStock = stock > 0
  const displayPrice = getDisplayPrice(product)

  return (
    <div className="product-detail-page">
      <Breadcrumb
        items={[
          { title: <Link to="/">Trang chủ</Link> },
          ...(category
            ? [{ title: <Link to={`/products/${category.slug}`}>{category.title}</Link> }]
            : []),
          { title },
        ]}
        className="detail-breadcrumb"
      />

      <div className="detail-main">
        <div className="detail-image">
          <img alt={title} src={thumbnail} />
        </div>

        <div className="detail-info">
          <Title level={3} className="detail-title">{title}</Title>

          {category && (
            <Text className="detail-category">
              Danh mục: <Link to={`/products/${category.slug}`}>{category.title}</Link>
            </Text>
          )}

          <div className="detail-prices">
            {hasDiscount ? (
              <>
                <span className="detail-price-new">{formatCurrency(displayPrice)}</span>
                <span className="detail-price-old">{formatCurrency(price)}</span>
                <Tag color="red">-{discountPercentage}%</Tag>
              </>
            ) : (
              <span className="detail-price">{formatCurrency(price)}</span>
            )}
          </div>

          <div className="detail-stock">
            {inStock ? (
              <Tag color="green">Còn hàng ({stock})</Tag>
            ) : (
              <Tag color="red">Hết hàng</Tag>
            )}
          </div>

          <Divider />

          <div className="detail-actions">
            <div className="detail-quantity">
              <Text>Số lượng: </Text>
              <InputNumber
                min={1}
                max={stock}
                value={quantity}
                onChange={setQuantity}
                disabled={!inStock}
              />
            </div>

            <Button
              type="primary"
              size="large"
              icon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
              loading={adding}
              disabled={!inStock}
              className="detail-add-btn"
            >
              Thêm vào giỏ hàng
            </Button>
          </div>
        </div>
      </div>

      {description && (
        <div className="detail-description">
          <Title level={4}>Mô tả sản phẩm</Title>
          <div dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      )}
    </div>
  )
}

export default ProductDetail
