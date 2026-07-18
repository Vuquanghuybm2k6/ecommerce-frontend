import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Spin, Typography, Table, Rate, Tag, Button, Modal, message, Space, Image, Pagination, Upload, Input } from 'antd'
import { DeleteOutlined, EditOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons'
import useMyReviews from '../../hooks/useMyReviews'
import axiosClientAuth from '../../api/axiosClientAuth'
import API from '../../api/endpoints'
import './MyReviews.css'

const { Title, Text } = Typography
const { TextArea } = Input

const statusLabelMap = {
  approved: 'Đã duyệt',
  reported: 'Bị báo cáo',
  hidden: 'Đã ẩn',
  deleted: 'Đã bị xóa',
}

const statusColorMap = {
  approved: 'green',
  reported: 'volcano',
  hidden: 'red',
  deleted: 'default',
}

function MyReviews() {
  const { reviews, loading, pagination, refetch, deleteReview, updateReview } = useMyReviews()
  const [editModal, setEditModal] = useState({ open: false, review: null })
  const [editRating, setEditRating] = useState(5)
  const [editContent, setEditContent] = useState('')
  const [editFileList, setEditFileList] = useState([])
  const [editUploading, setEditUploading] = useState(false)
  const [editSubmitting, setEditSubmitting] = useState(false)

  const handleDelete = (reviewId) => {
    Modal.confirm({
      title: 'Xóa đánh giá',
      content: 'Bạn có chắc muốn xóa đánh giá này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: () => deleteReview(reviewId),
    })
  }

  const openEditModal = (review) => {
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
    setEditModal({ open: true, review })
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

    let images = editFileList.filter(f => f.url).map(f => f.url)
    const newFiles = editFileList.filter(f => f.originFileObj)
    if (newFiles.length > 0) {
      const urls = await uploadEditImages()
      if (urls === null) return
      images = urls
    }

    const data = { rating: editRating, content: editContent, images }
    setEditSubmitting(true)
    const success = await updateReview(editModal.review._id, data)
    setEditSubmitting(false)
    if (success) {
      setEditModal({ open: false, review: null })
    }
  }

  const columns = [
    {
      title: 'Sản phẩm',
      key: 'product',
      render: (_, record) => (
        <div className="review-product-cell">
          <img
            src={record.product?.variants?.[0]?.thumbnail || ''}
            alt={record.product?.title}
            className="review-product-thumb"
          />
          <Link to={`/products/detail/${record.product?.slug}`}>
            <Text>{record.product?.title}</Text>
          </Link>
        </div>
      ),
    },
    {
      title: 'Đánh giá',
      key: 'rating',
      render: (_, record) => <Rate disabled value={record.rating} />,
    },
    {
      title: 'Nội dung',
      key: 'content',
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          <Text ellipsis={{ tooltip: record.content }} style={{ maxWidth: 250 }}>
            {record.content || '—'}
          </Text>
          {record.images?.length > 0 && (
            <Space size={4} wrap>
              {record.images.map((img, i) => (
                <Image key={i} src={img} alt={`review-img-${i}`} width={50} height={50} style={{ objectFit: 'cover', borderRadius: 4 }} preview={{ mask: null }} />
              ))}
            </Space>
          )}
        </Space>
      ),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Tag color={statusColorMap[record.status]}>{statusLabelMap[record.status]}</Tag>
          {record.status === 'deleted' && record.deletedReason && (
            <Text type="danger" style={{ fontSize: 11, maxWidth: 180 }} ellipsis={{ tooltip: record.deletedReason }}>
              {record.deletedReason}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Ngày',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (val) => new Date(val).toLocaleDateString('vi-VN'),
    },
    {
      title: '',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Link to={`/products/detail/${record.product?.slug}`}>
            <Button type="link" icon={<EyeOutlined />} size="small" />
          </Link>
          {record.status === 'approved' && (
            <>
              <Button
                type="link"
                icon={<EditOutlined />}
                size="small"
                disabled={!record.canEdit}
                onClick={() => record.canEdit && openEditModal(record)}
              />
              <Button
                danger
                type="link"
                icon={<DeleteOutlined />}
                size="small"
                disabled={!record.canEdit}
                onClick={() => record.canEdit && handleDelete(record._id)}
              />
              {!record.canEdit && (
                <Text type="secondary" style={{ fontSize: 11 }}>Hết hạn</Text>
              )}
            </>
          )}
        </Space>
      ),
    },
  ]

  if (loading) {
    return <div className="my-reviews-loading"><Spin size="large" /></div>
  }

  return (
    <div className="my-reviews-page">
      <Title level={3}>Đánh giá của tôi</Title>

      <Table
        dataSource={reviews}
        columns={columns}
        rowKey="_id"
        pagination={false}
        locale={{ emptyText: 'Bạn chưa có đánh giá nào' }}
      />

      {pagination && pagination.totalItem > pagination.limitItem && (
        <div className="my-reviews-pagination">
          <Pagination
            current={pagination.currentPage}
            total={pagination.totalItem}
            pageSize={pagination.limitItem}
            onChange={(page) => refetch(page)}
            showSizeChanger={false}
          />
        </div>
      )}

      <Modal
        title="Chỉnh sửa đánh giá"
        open={editModal.open}
        onCancel={() => setEditModal({ open: false, review: null })}
        footer={[
          <Button key="cancel" onClick={() => setEditModal({ open: false, review: null })}>Hủy</Button>,
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

export default MyReviews
