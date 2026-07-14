import { useState } from 'react'
import { Spin, Typography, Table, Tag, Button, Space, Rate, Modal, Select, Badge, Input, Image } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import useAdminReviews from '../../../hooks/useAdminReviews'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

const statusLabelMap = {
  approved: 'Đã duyệt',
  reported: 'Bị báo cáo',
  hidden: 'Đã ẩn',
  deleted: 'Đã xóa',
}

const statusColorMap = {
  approved: 'green',
  reported: 'volcano',
  hidden: 'red',
  deleted: 'default',
}

function AdminReviewList() {
  const { reviews, loading, pagination, statusCounts, refetch, deleteReview } = useAdminReviews()
  const [statusFilter, setStatusFilter] = useState('')
  const [deleteModal, setDeleteModal] = useState({ open: false, reviewId: null })
  const [deleteReason, setDeleteReason] = useState('')
  const [deleting, setDeleting] = useState(false)

  const handleFilterChange = (value) => {
    setStatusFilter(value)
    refetch({ status: value || undefined, page: 1 })
  }

  const openDeleteModal = (reviewId) => {
    setDeleteModal({ open: true, reviewId })
    setDeleteReason('')
  }

  const handleDelete = async () => {
    if (!deleteReason.trim()) {
      return
    }
    setDeleting(true)
    await deleteReview(deleteModal.reviewId, deleteReason.trim())
    setDeleting(false)
    setDeleteModal({ open: false, reviewId: null })
  }

  const columns = [
    {
      title: 'Sản phẩm',
      key: 'product',
      width: 200,
      render: (_, record) => (
        <div>
          <Text strong>{record.product?.title || '—'}</Text>
        </div>
      ),
    },
    {
      title: 'Người dùng',
      key: 'user',
      width: 150,
      render: (_, record) => (
        <Text>{record.user?.fullName || '—'}</Text>
      ),
    },
    {
      title: 'Đánh giá',
      key: 'rating',
      width: 140,
      render: (_, record) => <Rate disabled value={record.rating} />,
    },
    {
      title: 'Nội dung',
      key: 'content',
      width: 300,
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          <Paragraph ellipsis={{ rows: 2, tooltip: record.content }} style={{ margin: 0, maxWidth: 280 }}>
            {record.content || '—'}
          </Paragraph>
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
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status, record) => (
        <Space direction="vertical" size={0}>
          <Tag color={statusColorMap[status]}>{statusLabelMap[status]}</Tag>
          {status === 'deleted' && record.deletedReason && (
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
      width: 100,
      render: (val) => new Date(val).toLocaleDateString('vi-VN'),
    },
    {
      title: '',
      key: 'action',
      width: 130,
      render: (_, record) => (
        <Space>
          {record.status !== 'deleted' && (
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => openDeleteModal(record._id)}
            >
              Xóa
            </Button>
          )}
        </Space>
      ),
    },
  ]

  if (loading && reviews.length === 0) {
    return <div style={{ textAlign: 'center', padding: 60 }}><Spin size="large" /></div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Quản lý đánh giá</Title>
        <Space>
          <Badge count={statusCounts?.reported || 0} size="small" offset={[6, 0]}>
            <Select
              value={statusFilter}
              onChange={handleFilterChange}
              style={{ width: 150 }}
              options={[
                { value: '', label: 'Tất cả' },
                { value: 'approved', label: 'Đã duyệt' },
                { value: 'reported', label: 'Bị báo cáo' },
                { value: 'hidden', label: 'Đã ẩn' },
                { value: 'deleted', label: 'Đã xóa' },
              ]}
            />
          </Badge>
        </Space>
      </div>

      <Table
        dataSource={reviews}
        columns={columns}
        rowKey="_id"
        pagination={{
          current: pagination?.currentPage || 1,
          total: pagination?.totalItem || 0,
          pageSize: pagination?.limitItem || 10,
          onChange: (page) => refetch({ status: statusFilter || undefined, page }),
          showSizeChanger: false,
        }}
        locale={{ emptyText: 'Chưa có đánh giá nào' }}
      />

      <Modal
        title="Xóa đánh giá vi phạm"
        open={deleteModal.open}
        onCancel={() => setDeleteModal({ open: false, reviewId: null })}
        okText="Xóa đánh giá"
        cancelText="Hủy"
        okButtonProps={{ danger: true, disabled: !deleteReason.trim(), loading: deleting }}
        onOk={handleDelete}
      >
        <div style={{ marginBottom: 12 }}>
          <Text strong style={{ color: '#e74c3c' }}>
            Bạn chỉ nên xóa những đánh giá thiếu văn minh, vi phạm quy định.
          </Text>
        </div>
        <div style={{ marginBottom: 8 }}>
          <Text>Lý do xóa:</Text>
        </div>
        <TextArea
          rows={3}
          value={deleteReason}
          onChange={(e) => setDeleteReason(e.target.value)}
          placeholder="Nhập lý do xóa đánh giá (sẽ gửi thông báo cho người dùng)..."
        />
      </Modal>
    </div>
  )
}

export default AdminReviewList
