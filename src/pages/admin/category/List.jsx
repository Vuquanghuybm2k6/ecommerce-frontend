import { Link } from 'react-router-dom'
import { Typography, Table, Image, Tag, Button, Space, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import useAdminCategories from '../../../hooks/useAdminCategories'

const { Title } = Typography

function AdminCategoryList() {
  const { records, loading, deleteCategory } = useAdminCategories()

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 60,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: 80,
      render: (src) => src ? <Image src={src} width={50} height={50} style={{ objectFit: 'cover', borderRadius: 4 }} /> : null,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (val) => (
        <Tag color={val === 'active' ? 'green' : 'red'}>
          {val === 'active' ? 'Hoạt động' : 'Dừng hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Vị trí',
      dataIndex: 'position',
      key: 'position',
      width: 80,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 220,
      render: (_, record) => (
        <Space>
          <Link to={`/admin/products-category/edit/${record._id}`}>
            <Button type="link" size="small">Sửa</Button>
          </Link>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => {
              Modal.confirm({
                title: 'Xác nhận xóa',
                content: `Bạn có chắc muốn xóa danh mục "${record.title}"?`,
                onOk: () => deleteCategory(record._id, record.title),
              })
            }}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={3}>Danh mục sản phẩm</Title>
        <Link to="/admin/products-category/create">
          <Button type="primary" icon={<PlusOutlined />}>Thêm mới</Button>
        </Link>
      </div>

      <Table
        rowKey="_id"
        loading={loading}
        columns={columns}
        dataSource={records}
        pagination={false}
      />
    </div>
  )
}

export default AdminCategoryList
