import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Typography, Table, Button, Space, Input, Pagination, Modal } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import useAdminRoles from '../../../hooks/useAdminRoles'

const { Title } = Typography

function AdminRoleList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const keyword = searchParams.get('keyword') || ''
  const page = parseInt(searchParams.get('page')) || 1
  const [searchText, setSearchText] = useState(keyword)

  const { roles, pagination, loading, deleteRole } = useAdminRoles({ keyword, page })

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams)
    if (searchText) params.set('keyword', searchText)
    else params.delete('keyword')
    params.delete('page')
    setSearchParams(params)
  }

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    setSearchParams(params)
  }

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_, __, idx) => (page - 1) * (pagination?.limitItem || 10) + idx + 1,
    },
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description', ellipsis: true },
    {
      title: 'Hành động',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <Space>
          <Link to={`/admin/roles/edit/${record._id}`}>
            <Button type="link" size="small">Sửa</Button>
          </Link>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => {
              Modal.confirm({
                title: 'Xác nhận xóa',
                content: `Bạn có chắc muốn xóa nhóm quyền "${record.title}"?`,
                onOk: () => deleteRole(record._id, record.title),
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
        <Title level={3}>Danh sách nhóm quyền</Title>
        <Space>
          <Link to="/admin/roles/permissions">
            <Button>Phân quyền</Button>
          </Link>
          <Link to="/admin/roles/create">
            <Button type="primary" icon={<PlusOutlined />}>Thêm mới</Button>
          </Link>
        </Space>
      </div>

      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Input
          placeholder="Tìm kiếm nhóm quyền..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          onPressEnter={handleSearch}
          style={{ width: 300 }}
        />

        <Table
          rowKey="_id"
          loading={loading}
          columns={columns}
          dataSource={roles}
          pagination={false}
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

export default AdminRoleList
