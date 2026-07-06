import { useState, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Typography, Table, Image, Switch, Space, Button, Input, Pagination, Modal } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import useAdminProducts from '../../../hooks/useAdminProducts'
import AdminFilterStatus from '../../../components/admin/AdminFilterStatus'

const { Title } = Typography

function AdminProductList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const status = searchParams.get('status') || ''
  const keyword = searchParams.get('keyword') || ''
  const page = parseInt(searchParams.get('page')) || 1
  const sortKey = searchParams.get('sortKey') || ''
  const sortValue = searchParams.get('sortValue') || ''
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [searchText, setSearchText] = useState(keyword)

  const {
    products, filterStatus, pagination,
    loading, changeStatus, changeMulti, deleteProduct
  } = useAdminProducts({ status, keyword, page, sortKey, sortValue })

  const updateParams = useCallback((updates) => {
    const params = new URLSearchParams(searchParams)
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value)
      else params.delete(key)
    }
    setSearchParams(params)
  }, [searchParams, setSearchParams])

  const handleFilterChange = (newStatus) => updateParams({ status: newStatus, page: '' })

  const handleSearch = () => updateParams({ keyword: searchText, page: '' })

  const handlePageChange = (newPage) => updateParams({ page: String(newPage) })

  const handleTableChange = (_, __, sorter) => {
    if (sorter.field) {
      updateParams({ sortKey: sorter.field, sortValue: sorter.order === 'ascend' ? 'asc' : 'desc' })
    } else {
      updateParams({ sortKey: '', sortValue: '' })
    }
  }

  const handleBulkAction = (type) => {
    if (selectedRowKeys.length === 0) return
    if (type === 'delete-all') {
      Modal.confirm({
        title: 'Xác nhận xóa',
        content: `Bạn có chắc muốn xóa ${selectedRowKeys.length} sản phẩm?`,
        onOk: () => changeMulti(type, selectedRowKeys),
      })
    } else {
      changeMulti(type, selectedRowKeys)
    }
  }

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_, __, idx) => (page - 1) * (pagination?.limitItem || 10) + idx + 1,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: 80,
      render: (src) => src ? <Image src={src} width={50} height={50} style={{ objectFit: 'cover' }} /> : null,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      sorter: true,
      render: (val) => val?.toLocaleString() + 'đ',
    },
    {
      title: 'Kho',
      dataIndex: 'stock',
      key: 'stock',
      width: 80,
      sorter: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (val, record) => (
        <Switch
          checked={val === 'active'}
          onChange={(checked) => changeStatus(record._id, checked ? 'active' : 'inactive')}
        />
      ),
    },
    {
      title: 'Vị trí',
      dataIndex: 'position',
      key: 'position',
      width: 80,
      sorter: true,
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 200,
      render: (_, record) => (
        <Space>
          <Link to={`/admin/products/detail/${record._id}`}>
            <Button type="link" size="small">Chi tiết</Button>
          </Link>
          <Link to={`/admin/products/edit/${record._id}`}>
            <Button type="link" size="small">Sửa</Button>
          </Link>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => {
              Modal.confirm({
                title: 'Xác nhận xóa',
                content: `Bạn có chắc muốn xóa "${record.title}"?`,
                onOk: () => deleteProduct(record._id),
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
        <Title level={3}>Danh sách sản phẩm</Title>
        <Link to="/admin/products/create">
          <Button type="primary" icon={<PlusOutlined />}>Thêm mới</Button>
        </Link>
      </div>

      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <AdminFilterStatus items={filterStatus} activeStatus={status} onChange={handleFilterChange} />

        <Input
          placeholder="Tìm kiếm sản phẩm..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: 300 }}
        />

        {selectedRowKeys.length > 0 && (
          <Space>
            <Button type="primary" onClick={() => handleBulkAction('active')}>Kích hoạt</Button>
            <Button danger onClick={() => handleBulkAction('inactive')}>Vô hiệu</Button>
            <Button danger onClick={() => handleBulkAction('delete-all')}>Xóa tất cả</Button>
          </Space>
        )}

        <Table
          rowKey="_id"
          loading={loading}
          columns={columns}
          dataSource={products}
          pagination={false}
          onChange={handleTableChange}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
        />

        {pagination && (
          <Pagination
            current={pagination.currentPage}
            total={pagination.totalPage * pagination.limitItem}
            pageSize={pagination.limitItem}
            onChange={handlePageChange}
            style={{ textAlign: 'right' }}
          />
        )}
      </Space>
    </div>
  )
}

export default AdminProductList
