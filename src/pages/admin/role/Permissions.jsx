import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Typography, Table, Checkbox, Button, Space, Spin } from 'antd'
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import useAdminRolePermissions from '../../../hooks/useAdminRolePermissions'

const { Title } = Typography

const permissionGroups = [
  {
    title: 'Dashboard',
    children: [
      { key: 'dashboard_view', label: 'Xem' },
    ],
  },
  {
    title: 'Sản phẩm',
    children: [
      { key: 'products_view', label: 'Xem danh sách' },
      { key: 'products_create', label: 'Thêm mới' },
      { key: 'products_edit', label: 'Chỉnh sửa' },
      { key: 'products_delete', label: 'Xóa' },
    ],
  },
  {
    title: 'Danh mục sản phẩm',
    children: [
      { key: 'product-category_view', label: 'Xem danh sách' },
      { key: 'product-category_create', label: 'Thêm mới' },
      { key: 'product-category_edit', label: 'Chỉnh sửa' },
      { key: 'product-category_delete', label: 'Xóa' },
    ],
  },
  {
    title: 'Nhóm quyền',
    children: [
      { key: 'roles_view', label: 'Xem danh sách' },
      { key: 'roles_create', label: 'Thêm mới' },
      { key: 'roles_edit', label: 'Chỉnh sửa' },
      { key: 'roles_delete', label: 'Xóa' },
      { key: 'roles_permissions', label: 'Phân quyền' },
    ],
  },
  {
    title: 'Tài khoản admin',
    children: [
      { key: 'accounts_view', label: 'Xem danh sách' },
      { key: 'accounts_create', label: 'Thêm mới' },
      { key: 'accounts_edit', label: 'Chỉnh sửa' },
      { key: 'accounts_delete', label: 'Xóa' },
    ],
  },
  {
    title: 'Cài đặt',
    children: [
      { key: 'settings_view', label: 'Xem' },
      { key: 'settings_edit', label: 'Chỉnh sửa' },
    ],
  },
]

function flattenPermissions() {
  return permissionGroups.flatMap(group => [
    { key: `__group__${group.title}`, type: 'group', label: group.title, group },
    ...group.children.map(p => ({ key: p.key, type: 'item', label: p.label })),
  ])
}

const flattenedData = flattenPermissions()

function RolePermissions() {
  const navigate = useNavigate()
  const { roles, loading, saving, savePermissions } = useAdminRolePermissions()
  const [permMap, setPermMap] = useState({})

  useEffect(() => {
    if (!roles.length) return
    const map = {}
    roles.forEach(role => {
      map[role._id] = [...(role.permissions || [])]
    })
    setPermMap(map)
  }, [roles])

  const handleToggle = useCallback((roleId, permKey, checked) => {
    setPermMap(prev => {
      const perms = [...(prev[roleId] || [])]
      if (checked) {
        if (!perms.includes(permKey)) perms.push(permKey)
      } else {
        const idx = perms.indexOf(permKey)
        if (idx !== -1) perms.splice(idx, 1)
      }
      return { ...prev, [roleId]: perms }
    })
  }, [])

  const handleGroupToggle = useCallback((roleId, group, checked) => {
    const keys = group.children.map(c => c.key)
    setPermMap(prev => {
      const perms = [...(prev[roleId] || [])]
      keys.forEach(key => {
        if (checked) {
          if (!perms.includes(key)) perms.push(key)
        } else {
          const idx = perms.indexOf(key)
          if (idx !== -1) perms.splice(idx, 1)
        }
      })
      return { ...prev, [roleId]: perms }
    })
  }, [])

  const handleSave = useCallback(() => {
    const data = roles.map(role => ({
      id: role._id,
      permissions: permMap[role._id] || [],
    }))
    savePermissions(data)
  }, [roles, permMap, savePermissions])

  const columns = useMemo(() => {
    const cols = [
      {
        title: 'Tính năng',
        dataIndex: 'label',
        key: 'label',
        width: 220,
        onCell: (record) => (record.type === 'group' ? { colSpan: roles.length + 1 } : {}),
        render: (text, record) => {
          if (record.type === 'group' && record.group) {
            const group = record.group
            return (
              <Space>
                <Checkbox
                  indeterminate={
                    roles.some(role => {
                      const perms = permMap[role._id] || []
                      const keys = group.children.map(c => c.key)
                      const checked = keys.filter(k => perms.includes(k))
                      return checked.length > 0 && checked.length < keys.length
                    })
                  }
                  checked={roles.length > 0 && roles.every(role => {
                    const perms = permMap[role._id] || []
                    return group.children.every(c => perms.includes(c.key))
                  })}
                  onChange={e => {
                    roles.forEach(role => handleGroupToggle(role._id, group, e.target.checked))
                  }}
                />
                <strong>{text}</strong>
              </Space>
            )
          }
          return text
        },
      },
      ...roles.map(role => ({
        title: role.title,
        key: role._id,
        width: 140,
        onCell: (record) => (record.type === 'group' ? { colSpan: 0 } : {}),
        render: (_, record) => {
          if (record.type === 'group') return null
          const rolePerms = permMap[role._id] || []
          return (
            <Checkbox
              checked={rolePerms.includes(record.key)}
              onChange={e => handleToggle(role._id, record.key, e.target.checked)}
            />
          )
        },
      })),
    ]
    return cols
  }, [roles, permMap, handleToggle, handleGroupToggle])

  if (loading) {
    return <Spin size="large" style={{ display: 'block', marginTop: 80, textAlign: 'center' }} />
  }

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/roles')}>Quay lại</Button>
        <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saving}>
          Lưu thay đổi
        </Button>
      </Space>
      <Title level={3}>Phân quyền</Title>

      <div style={{ overflowX: 'auto' }}>
        <Table
          rowKey="key"
          columns={columns}
          dataSource={flattenedData}
          pagination={false}
          bordered
          size="small"
        />
      </div>
    </div>
  )
}

export default RolePermissions
