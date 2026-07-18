import { useNavigate, useParams, Link } from 'react-router-dom'
import { Typography, Image, Tag, Descriptions, Button, Space, Spin, Table } from 'antd'
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons'
import useAdminProductDetail from '../../../hooks/useAdminProductDetail'

const { Title, Text } = Typography

function AdminProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { product, loading } = useAdminProductDetail(id)

  if (loading) {
    return <Spin size="large" style={{ display: 'block', marginTop: 80, textAlign: 'center' }} />
  }

  if (!product) {
    return <Typography.Text type="danger">Không tìm thấy sản phẩm</Typography.Text>
  }

  const firstVariant = product.variants?.[0]
  const thumbnail = firstVariant?.thumbnail || ''

  const variantColumns = [
    { title: 'SKU', dataIndex: 'sku', key: 'sku' },
    { title: 'Nhãn', dataIndex: 'label', key: 'label' },
    {
      title: 'Thuộc tính',
      key: 'options',
      render: (_, record) =>
        record.options?.map(o => `${o.key}: ${o.value}`).join(', ') || '',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: v => v?.toLocaleString() + 'đ',
    },
    {
      title: 'Giảm giá',
      dataIndex: 'discountPercentage',
      key: 'discountPercentage',
      render: v => (v || 0) + '%',
    },
    { title: 'Tồn kho', dataIndex: 'stock', key: 'stock' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: v => (
        <Tag color={v === 'active' ? 'green' : 'red'}>
          {v === 'active' ? 'Hoạt động' : 'Dừng hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Ảnh',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: v => v ? <Image src={v} width={50} /> : null,
    },
  ]

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/products')}>Quay lại</Button>
        <Link to={`/admin/products/edit/${product._id}`}>
          <Button type="primary" icon={<EditOutlined />}>Chỉnh sửa</Button>
        </Link>
      </Space>

      <Title level={3}>Chi tiết sản phẩm</Title>

      <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
        {thumbnail && (
          <Image
            src={thumbnail}
            alt={product.title}
            width={200}
            style={{ objectFit: 'cover', borderRadius: 8 }}
          />
        )}
        <div style={{ flex: 1 }}>
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="Tiêu đề" span={2}>{product.title}</Descriptions.Item>
            <Descriptions.Item label="Giá">
              {firstVariant?.price?.toLocaleString() || 0}đ
            </Descriptions.Item>
            <Descriptions.Item label="Giảm giá">
              {firstVariant?.discountPercentage || 0}%
            </Descriptions.Item>
            <Descriptions.Item label="Kho">{firstVariant?.stock || 0}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={product.status === 'active' ? 'green' : 'red'}>
                {product.status === 'active' ? 'Hoạt động' : 'Dừng hoạt động'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Nổi bật">
              {product.featured === '1' ? <Tag color="blue">Nổi bật</Tag> : 'Không'}
            </Descriptions.Item>
            <Descriptions.Item label="Vị trí">{product.position}</Descriptions.Item>
            <Descriptions.Item label="Slug">{product.slug}</Descriptions.Item>
          </Descriptions>
        </div>
      </div>

      {product.variants?.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <Title level={5}>Biến thể sản phẩm</Title>
          <Table
            dataSource={product.variants}
            columns={variantColumns}
            rowKey="sku"
            pagination={false}
            bordered
            size="small"
          />
        </div>
      )}

      {product.description && (
        <div>
          <Title level={5}>Mô tả</Title>
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>
      )}
    </div>
  )
}

export default AdminProductDetail