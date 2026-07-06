import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Typography, Table, Image, Switch, Button, Space, Input, Pagination, Modal } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import useAdminAccounts from '../../../hooks/useAdminAccounts'

const { Title } = Typography

function AdminAccountList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const keyword = searchParams.get('keyword') || ''
  const page = parseInt(searchParams.get('page')) || 1
  const [searchText, setSearchText] = useState(keyword)

  const { records, pagination, loading, changeStatus, deleteAccount } = useAdminAccounts({ keyword, page })

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
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 70,
      render: (src) => src ? <Image src={src} width={40} height={40} style={{ objectFit: 'cover', borderRadius: '50%' }} /> : null,
    },
    { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Nhóm quyền',
      key: 'role',
      render: (_, record) => record.role?.title || '—',
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
      title: 'Hành động',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <Space>
          <Link to={`/admin/accounts/edit/${record._id}`}>
            <Button type="link" size="small">Sửa</Button>
          </Link>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => {
              Modal.confirm({
                title: 'Xác nhận xóa',
                content: `Bạn có chắc muốn xóa tài khoản "${record.fullName}"?`,
                onOk: () => deleteAccount(record._id, record.fullName),
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
        <Title level={3}>Danh sách tài khoản</Title>
        <Link to="/admin/accounts/create">
          <Button type="primary" icon={<PlusOutlined />}>Thêm mới</Button>
        </Link>
      </div>

      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <Input
          placeholder="Tìm kiếm tài khoản..."
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
          dataSource={records}
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

export default AdminAccountList
