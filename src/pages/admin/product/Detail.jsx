import { useNavigate, useParams, Link } from 'react-router-dom'
import { Typography, Image, Tag, Descriptions, Button, Space, Spin } from 'antd'
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons'
import useAdminProductDetail from '../../../hooks/useAdminProductDetail'

const { Title } = Typography

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
        {product.thumbnail && (
          <Image
            src={product.thumbnail}
            alt={product.title}
            width={200}
            style={{ objectFit: 'cover', borderRadius: 8 }}
          />
        )}
        <div style={{ flex: 1 }}>
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="Tiêu đề" span={2}>{product.title}</Descriptions.Item>
            <Descriptions.Item label="Giá">{product.price?.toLocaleString()}đ</Descriptions.Item>
            <Descriptions.Item label="Giảm giá">{product.discountPercentage || 0}%</Descriptions.Item>
            <Descriptions.Item label="Kho">{product.stock}</Descriptions.Item>
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
