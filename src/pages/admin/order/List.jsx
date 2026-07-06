import { useState, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Typography, Table, Tag, Space, Button, Input, Pagination, Modal, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import useAdminOrders from '../../../hooks/useAdminOrders'
import AdminFilterStatus from '../../../components/admin/AdminFilterStatus'
import { formatCurrency } from '../../../utils/price'

const { Title, Text } = Typography

const statusColorMap = {
  pending: 'orange',
  confirmed: 'blue',
  shipped: 'cyan',
  delivered: 'green',
  cancelled: 'red',
}

const statusLabelMap = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipped: 'Đang giao hàng',
  delivered: 'Đã giao hàng',
  cancelled: 'Đã hủy',
}

const VALID_TRANSITIONS = {
  pending:    ["confirmed", "cancelled"],
  confirmed:  ["shipped", "cancelled"],
  shipped:    ["delivered"],
  delivered:  [],
  cancelled:  [],
}

function AdminOrderList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const status = searchParams.get('status') || ''
  const keyword = searchParams.get('keyword') || ''
  const page = parseInt(searchParams.get('page')) || 1
  const sortKey = searchParams.get('sortKey') || ''
  const sortValue = searchParams.get('sortValue') || ''
  const [searchText, setSearchText] = useState(keyword)

  const { orders, filterStatus, pagination, loading, changeStatus, deleteOrder } = useAdminOrders({
    status, keyword, page, sortKey, sortValue
  })

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

  const handleStatusChange = (id, newStatus) => {
    Modal.confirm({
      title: 'Xác nhận đổi trạng thái',
      content: `Chuyển đơn hàng sang "${statusLabelMap[newStatus]}"?`,
      onOk: () => changeStatus(id, newStatus),
    })
  }

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_, __, idx) => (page - 1) * (pagination?.limitItem || 10) + idx + 1,
    },
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderCode',
      key: 'orderCode',
      sorter: true,
      render: (val) => <Text strong>{val}</Text>,
    },
    {
      title: 'Người nhận',
      dataIndex: 'userInfo',
      key: 'userInfo',
      render: (info) => info?.fullName || '---',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'userInfo',
      key: 'phone',
      render: (info) => info?.phone || '---',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      sorter: true,
      render: (val) => <Text strong>{formatCurrency(val)}</Text>,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      render: (val) => val ? new Date(val).toLocaleDateString('vi-VN') : '---',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (val, record) => {
        const nextStatuses = VALID_TRANSITIONS[val] || []
        const options = [
          { value: val, label: <Tag color={statusColorMap[val]}>{statusLabelMap[val]}</Tag> },
          ...nextStatuses
            .filter(s => s !== val)
            .map(s => ({ value: s, label: <Tag color={statusColorMap[s]}>{statusLabelMap[s]}</Tag> })),
        ]
        return (
          <Select
            value={val}
            size="small"
            style={{ width: 150 }}
            onChange={(newStatus) => handleStatusChange(record._id, newStatus)}
            options={options}
          />
        )
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <Space>
          <Link to={`/admin/orders/detail/${record._id}`}>
            <Button type="link" size="small">Chi tiết</Button>
          </Link>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => {
              Modal.confirm({
                title: 'Xác nhận xóa',
                content: `Bạn có chắc muốn xóa đơn "${record.orderCode}"?`,
                onOk: () => deleteOrder(record._id),
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
        <Title level={3}>Quản lý đơn hàng</Title>
      </div>

      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <AdminFilterStatus items={filterStatus} activeStatus={status} onChange={handleFilterChange} />

        <Input
          placeholder="Tìm kiếm theo mã đơn hàng..."
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
          dataSource={orders}
          pagination={false}
          onChange={handleTableChange}
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

export default AdminOrderList
