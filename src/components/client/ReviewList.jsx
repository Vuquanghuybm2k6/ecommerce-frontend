import { useState } from 'react'
import { Rate, Typography, Avatar, Tag, Button, Empty, Spin, Pagination, Space, Image } from 'antd'
import { LikeOutlined, LikeFilled } from '@ant-design/icons'
import useReviews from '../../hooks/useReviews'
import axiosClientAuth from '../../api/axiosClientAuth'
import API from '../../api/endpoints'
import './ReviewList.css'

const { Text, Paragraph } = Typography

function ReviewList({ productId, onReviewAdded }) {
  const { reviews, loading, pagination, refetch } = useReviews(productId)
  const [sort, setSort] = useState('newest')
  const [helpfulLoading, setHelpfulLoading] = useState({})

  const handleHelpful = async (reviewId) => {
    setHelpfulLoading(prev => ({ ...prev, [reviewId]: true }))
    try {
      await axiosClientAuth.post(API.reviewsHelpful(reviewId))
      refetch(pagination?.currentPage || 1, sort)
    } catch {
      // silent
    } finally {
      setHelpfulLoading(prev => ({ ...prev, [reviewId]: false }))
    }
  }

  const handleSortChange = (newSort) => {
    setSort(newSort)
    refetch(1, newSort)
  }

  if (loading) {
    return <div className="review-loading"><Spin /></div>
  }

  return (
    <div className="review-list">
      <div className="review-list-header">
        <Text strong style={{ fontSize: 16 }}>Đánh giá ({pagination?.totalItem || 0})</Text>
        <Space>
          <Button
            type={sort === 'newest' ? 'primary' : 'default'}
            size="small"
            onClick={() => handleSortChange('newest')}
          >
            Mới nhất
          </Button>
          <Button
            type={sort === 'oldest' ? 'primary' : 'default'}
            size="small"
            onClick={() => handleSortChange('oldest')}
          >
            Cũ nhất
          </Button>
        </Space>
      </div>

      {reviews.length === 0 ? (
        <Empty description="Chưa có đánh giá nào" />
      ) : (
        <>
          {reviews.map(review => (
            <div key={review._id} className="review-card">
              <div className="review-user">
                <Avatar src={review.user?.avatar}>
                  {review.user?.fullName?.charAt(0)?.toUpperCase()}
                </Avatar>
                <div className="review-user-info">
                  <Text strong>{review.user?.fullName || 'Người dùng'}</Text>
                  <Tag color="blue" style={{ marginLeft: 8, fontSize: 11 }}>Đã mua hàng</Tag>
                </div>
              </div>
              <div className="review-body">
                <Rate disabled value={review.rating} />
                <Text type="secondary" className="review-date">
                  {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                  {review.editedAt && ' (đã chỉnh sửa)'}
                </Text>
              </div>
              {review.content && (
                <Paragraph className="review-content">{review.content}</Paragraph>
              )}
              {review.images?.length > 0 && (
                <div className="review-images">
                  <Space size={6} wrap>
                    {review.images.map((img, i) => (
                      <Image key={i} src={img} alt="review" width={80} height={80} style={{ objectFit: 'cover', borderRadius: 6 }} />
                    ))}
                  </Space>
                </div>
              )}
              <div className="review-actions">
                <Button
                  type="text"
                  size="small"
                  icon={review.helpful > 0 ? <LikeFilled /> : <LikeOutlined />}
                  loading={helpfulLoading[review._id]}
                  onClick={() => handleHelpful(review._id)}
                >
                  Hữu ích ({review.helpful})
                </Button>
              </div>
            </div>
          ))}

          {pagination && pagination.totalItem > pagination.limitItem && (
            <div className="review-pagination">
              <Pagination
                current={pagination.currentPage}
                total={pagination.totalItem}
                pageSize={pagination.limitItem}
                onChange={(page) => refetch(page, sort)}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ReviewList
