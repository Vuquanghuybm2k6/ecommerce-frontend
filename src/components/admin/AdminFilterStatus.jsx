import { Button, Space } from 'antd'

function AdminFilterStatus({ items, activeStatus, onChange }) {
  return (
    <Space>
      {items.map(item => (
        <Button
          key={item.status}
          type={item.status === activeStatus ? 'primary' : 'default'}
          onClick={() => onChange(item.status)}
        >
          {item.name}
        </Button>
      ))}
    </Space>
  )
}

export default AdminFilterStatus
