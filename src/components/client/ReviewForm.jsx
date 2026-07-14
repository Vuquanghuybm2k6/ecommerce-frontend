import { useState, useEffect } from 'react'
import { Modal, Rate, Input, Button, Select, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import useCreateReview from '../../hooks/useCreateReview'
import axiosClientAuth from '../../api/axiosClientAuth'
import API from '../../api/endpoints'

const { TextArea } = Input

function ReviewForm({ productId, open, onClose, onSuccess }) {
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const [orderId, setOrderId] = useState('')
  const [orders, setOrders] = useState([])
  const [fileList, setFileList] = useState([])
  const { createReview, loading } = useCreateReview()
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (open && productId) {
      setRating(5)
      setContent('')
      setOrderId('')
      setFileList([])
      fetchUserReviewStatus()
    }
  }, [open, productId])

  const fetchUserReviewStatus = async () => {
    setLoadingOrders(true)
    try {
      const res = await axiosClientAuth.get(API.reviewsUserReview, {
        params: { productId }
      })
      setOrders(res.data.data.orders || [])
      if (res.data.data.orders.length > 0) {
        setOrderId(res.data.data.orders[0]._id)
      }
    } catch {
      // silent
    } finally {
      setLoadingOrders(false)
    }
  }

  const uploadImages = async () => {
    const formData = new FormData()
    fileList.forEach(file => {
      if (file.originFileObj) {
        formData.append('images', file.originFileObj)
      }
    })
    setUploading(true)
    try {
      const res = await axiosClientAuth.post(API.reviewsUploadImages, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return res.data.data.images || []
    } catch {
      message.error('Upload ảnh thất bại')
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!rating) {
      message.warning('Vui lòng chọn số sao')
      return
    }
    if (!orderId) {
      message.warning('Vui lòng chọn đơn hàng')
      return
    }

    let images = []
    if (fileList.length > 0) {
      const urls = await uploadImages()
      if (urls === null) return
      images = urls
    }

    const data = { product_id: productId, order_id: orderId, rating, content, images }

    const success = await createReview(data)
    if (success) {
      onClose()
      if (onSuccess) onSuccess()
    }
  }

  return (
    <Modal
      title="Đánh giá sản phẩm"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Hủy</Button>,
        <Button key="submit" type="primary" loading={loading || uploading} onClick={handleSubmit}>
          Gửi đánh giá
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8 }}>Chất lượng sản phẩm:</div>
        <Rate value={rating} onChange={setRating} />
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8 }}>Chọn đơn hàng đã mua:</div>
        <Select
          value={orderId}
          onChange={setOrderId}
          style={{ width: '100%' }}
          loading={loadingOrders}
          placeholder="Chọn đơn hàng"
          options={orders.map(o => ({
            value: o._id,
            label: `${o.orderCode} - ${new Date(o.createdAt).toLocaleDateString('vi-VN')}`
          }))}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8 }}>Nội dung đánh giá (tùy chọn):</div>
        <TextArea
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={2000}
          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
        />
      </div>

      <div>
        <div style={{ marginBottom: 8 }}>Hình ảnh (tùy chọn):</div>
        <Upload
          listType="picture"
          fileList={fileList}
          onChange={({ fileList: fl }) => setFileList(fl)}
          beforeUpload={() => false}
          maxCount={5}
          accept="image/*"
        >
          <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
        </Upload>
      </div>
    </Modal>
  )
}

export default ReviewForm
