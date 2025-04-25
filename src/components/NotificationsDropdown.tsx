import React from 'react';
import { Dropdown, Badge, List, Typography, Space, Button } from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import { notificationService } from '../lib/notificationService';

const { Text } = Typography;

interface NotificationsDropdownProps {
  notifications: any[];
  onNotificationClick: (notification: any) => void;
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  notifications,
  onNotificationClick,
}) => {
  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      await Promise.all(unreadNotifications.map(n => notificationService.markAsRead(n.id)));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const menu = {
    items: [
      {
        key: 'header',
        label: (
          <div style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0' }}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Text strong>Notifications</Text>
              {notifications.some(n => !n.isRead) && (
                <Button
                  type="text"
                  size="small"
                  icon={<CheckOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAllAsRead();
                  }}
                >
                  Mark all as read
                </Button>
              )}
            </Space>
          </div>
        ),
      },
      {
        key: 'notifications',
        label: (
          <List
            style={{ width: 300, maxHeight: 400, overflowY: 'auto' }}
            dataSource={notifications}
            renderItem={(notification) => (
              <List.Item
                style={{
                  padding: '8px 16px',
                  cursor: 'pointer',
                  backgroundColor: notification.isRead ? 'transparent' : '#f0f7ff',
                }}
                onClick={() => onNotificationClick(notification)}
              >
                <List.Item.Meta
                  avatar={<BellOutlined style={{ fontSize: 20 }} />}
                  title={<Text strong>{notification.title}</Text>}
                  description={
                    <Space direction="vertical" size={0}>
                      <Text type="secondary">{notification.message}</Text>
                      <Text type="secondary" style={{ fontSize: '0.75em' }}>
                        {new Date(notification.createdAt).toLocaleString()}
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        ),
      },
    ],
  };

  return (
    <Dropdown menu={menu} trigger={['click']} placement="bottomRight">
      <Badge count={notifications.filter(n => !n.isRead).length} offset={[-5, 5]}>
        <Button
          type="text"
          icon={<BellOutlined style={{ fontSize: 20 }} />}
          style={{ padding: '4px 8px' }}
        />
      </Badge>
    </Dropdown>
  );
};

export default NotificationsDropdown; 