import { useState } from 'react'
import { Spin, Typography, List, Tag, Button, Empty, Pagination, Space } from 'antd'
import { BellOutlined, CheckOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import useNotifications from '../../hooks/useNotifications'
import './Notifications.css'

const { Title, Text, Paragraph } = Typography

const typeLabelMap = {
  review_deleted: 'Đánh giá bị xóa',
  order_status_changed: 'Đơn hàng',
}

const typeColorMap = {
  review_deleted: 'red',
  order_status_changed: 'blue',
}

function Notifications() {
  const { notifications, loading, pagination, refetch, markRead, markAllRead } = useNotifications()

  if (loading && notifications.length === 0) {
    return <div className="notifications-loading"><Spin size="large" /></div>
  }

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <Title level={3}>Thông báo</Title>
        {notifications.some(n => !n.read) && (
          <Button size="small" icon={<CheckOutlined />} onClick={markAllRead}>
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>

      <List
        dataSource={notifications}
        locale={{ emptyText: <Empty description="Không có thông báo nào" /> }}
        renderItem={(item) => (
          <List.Item
            className={`notification-item ${!item.read ? 'notification-unread' : ''}`}
            onClick={() => { if (!item.read) markRead(item._id) }}
            actions={
              !item.read
                ? [<Button type="link" size="small" icon={<CheckOutlined />} onClick={(e) => { e.stopPropagation(); markRead(item._id) }}>Đã đọc</Button>]
                : []
            }
          >
            <List.Item.Meta
              avatar={
                <div className={`notification-icon notification-icon-${item.type}`}>
                  {item.type === 'order_status_changed' ? <ShoppingCartOutlined /> : <BellOutlined />}
                </div>
              }
              title={
                <Space>
                  <Text strong={!item.read}>{item.title}</Text>
                  <Tag color={typeColorMap[item.type]} style={{ fontSize: 11 }}>{typeLabelMap[item.type]}</Tag>
                  {!item.read && <span className="notification-dot" />}
                </Space>
              }
              description={
                <div>
                  <Paragraph style={{ margin: 0 }}>{item.message}</Paragraph>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {new Date(item.createdAt).toLocaleString('vi-VN')}
                  </Text>
                </div>
              }
            />
          </List.Item>
        )}
      />

      {pagination && pagination.totalItem > pagination.limitItem && (
        <div className="notifications-pagination">
          <Pagination
            current={pagination.currentPage}
            total={pagination.totalItem}
            pageSize={pagination.limitItem}
            onChange={(page) => refetch(page)}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  )
}

export default Notifications
