import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Spin, Typography, Button, InputNumber, Breadcrumb, Tag, Divider, notification, Rate, Modal, Space, Upload, Input, message } from 'antd'
import { ShoppingCartOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import axiosClient from '../../api/axiosClient'
import axiosClientAuth from '../../api/axiosClientAuth'
import API from '../../api/endpoints'
import useProductDetail from '../../hooks/useProductDetail'
import useCartStore from '../../store/cartStore'
import useAuthStore from '../../store/authStore'
import { formatCurrency, getDisplayPrice } from '../../utils/price'
import ReviewList from '../../components/client/ReviewList'
import ReviewForm from '../../components/client/ReviewForm'
import './ProductDetail.css'

const { Title, Text } = Typography
const { TextArea } = Input

function ProductDetail() {
  const { slug } = useParams()
  const { product, loading, error } = useProductDetail(slug)
  const { updateCartId, setTotalQuantity } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [reviewFormOpen, setReviewFormOpen] = useState(false)
  const [userReviewStatus, setUserReviewStatus] = useState(null)
  const [editModal, setEditModal] = useState({ open: false })
  const [editRating, setEditRating] = useState(5)
  const [editContent, setEditContent] = useState('')
  const [editFileList, setEditFileList] = useState([])
  const [editUploading, setEditUploading] = useState(false)
  const [editSubmitting, setEditSubmitting] = useState(false)

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

  useEffect(() => {
    if (isAuthenticated && product?._id) {
      axiosClientAuth.get(API.reviewsUserReview, { params: { productId: product._id } })
        .then(res => setUserReviewStatus(res.data.data))
        .catch(() => {})
    }
  }, [isAuthenticated, product?._id])

  const openEditModal = () => {
    const review = userReviewStatus?.existingReview
    if (!review) return
    setEditRating(review.rating)
    setEditContent(review.content || '')
    setEditFileList(
      (review.images || []).map((url, i) => ({
        uid: `-${i}`,
        name: `image-${i}`,
        status: 'done',
        url,
      }))
    )
    setEditModal({ open: true })
  }

  const uploadEditImages = async () => {
    const newFiles = editFileList.filter(f => f.originFileObj)
    if (newFiles.length === 0) {
      return editFileList.filter(f => f.url).map(f => f.url)
    }
    const formData = new FormData()
    newFiles.forEach(f => formData.append('images', f.originFileObj))
    setEditUploading(true)
    try {
      const res = await axiosClientAuth.post(API.reviewsUploadImages, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      const newUrls = res.data.data.images || []
      const oldUrls = editFileList.filter(f => f.url).map(f => f.url)
      return [...oldUrls, ...newUrls]
    } catch {
      message.error('Upload ảnh thất bại')
      return null
    } finally {
      setEditUploading(false)
    }
  }

  const handleEditSubmit = async () => {
    if (!editRating) {
      message.warning('Vui lòng chọn số sao')
      return
    }
    const reviewId = userReviewStatus?.existingReview?._id
    if (!reviewId) return

    let images = editFileList.filter(f => f.url).map(f => f.url)
    const newFiles = editFileList.filter(f => f.originFileObj)
    if (newFiles.length > 0) {
      const urls = await uploadEditImages()
      if (urls === null) return
      images = urls
    }

    const data = { rating: editRating, content: editContent, images }
    setEditSubmitting(true)
    try {
      await axiosClientAuth.patch(API.reviewsUpdate(reviewId), data)
      message.success('Cập nhật đánh giá thành công')
      setEditModal({ open: false })
      axiosClientAuth.get(API.reviewsUserReview, { params: { productId: product._id } })
        .then(res => setUserReviewStatus(res.data.data))
        .catch(() => {})
    } catch (err) {
      message.error(err.response?.data?.message || 'Cập nhật thất bại')
    } finally {
      setEditSubmitting(false)
    }
  }

  const handleDelete = () => {
    const reviewId = userReviewStatus?.existingReview?._id
    if (!reviewId) return
    Modal.confirm({
      title: 'Xóa đánh giá',
      content: 'Bạn có chắc muốn xóa đánh giá này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await axiosClientAuth.delete(API.reviewsDelete(reviewId))
          message.success('Xóa đánh giá thành công')
          setUserReviewStatus(null)
        } catch (err) {
          message.error(err.response?.data?.message || 'Xóa thất bại')
        }
      },
    })
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
    ratingAvg,
    ratingCount,
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

          {(ratingAvg > 0 || ratingCount > 0) && (
            <div className="detail-rating">
              <Rate disabled value={ratingAvg} allowHalf />
              <Text type="secondary" style={{ marginLeft: 8 }}>
                {ratingAvg} ({ratingCount} đánh giá)
              </Text>
            </div>
          )}

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

      <div className="detail-reviews">
        {isAuthenticated && userReviewStatus?.canReview && (
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <Button type="primary" onClick={() => setReviewFormOpen(true)}>
              Viết đánh giá
            </Button>
          </div>
        )}
        {isAuthenticated && userReviewStatus?.existingReview && userReviewStatus?.existingReview?.status === 'approved' && (
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <Space>
              <Button icon={<EditOutlined />} disabled={!userReviewStatus?.canEdit} onClick={userReviewStatus?.canEdit ? openEditModal : undefined}>
                Sửa đánh giá
              </Button>
              <Button danger icon={<DeleteOutlined />} disabled={!userReviewStatus?.canEdit} onClick={userReviewStatus?.canEdit ? handleDelete : undefined}>
                Xóa đánh giá
              </Button>
              {!userReviewStatus?.canEdit && (
                <Text type="secondary">Đã quá 15 ngày kể từ khi mua hàng</Text>
              )}
            </Space>
          </div>
        )}
        <ReviewList productId={product._id} onReviewAdded={() => setReviewFormOpen(false)} />
        <ReviewForm
          productId={product._id}
          open={reviewFormOpen}
          onClose={() => setReviewFormOpen(false)}
          onSuccess={() => {
            setUserReviewStatus(null)
          }}
        />
      </div>

      <Modal
        title="Chỉnh sửa đánh giá"
        open={editModal.open}
        onCancel={() => setEditModal({ open: false })}
        footer={[
          <Button key="cancel" onClick={() => setEditModal({ open: false })}>Hủy</Button>,
          <Button key="submit" type="primary" loading={editUploading || editSubmitting} onClick={handleEditSubmit}>
            Lưu thay đổi
          </Button>,
        ]}
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8 }}>Đánh giá:</div>
          <Rate value={editRating} onChange={setEditRating} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8 }}>Nội dung (tùy chọn):</div>
          <TextArea
            rows={4}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            maxLength={2000}
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
          />
        </div>

        <div>
          <div style={{ marginBottom: 8 }}>Hình ảnh (tùy chọn):</div>
          <Upload
            listType="picture"
            fileList={editFileList}
            onChange={({ fileList: fl }) => setEditFileList(fl)}
            beforeUpload={() => false}
            maxCount={5}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </div>
      </Modal>
    </div>
  )
}

export default ProductDetail
