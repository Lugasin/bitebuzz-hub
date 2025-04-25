import React, { useState, useEffect, useRef } from 'react';
import { chatService } from '../lib/chatService';
import { notificationService } from '../lib/notificationService';
import { Button, Input, Card, Space, Typography, Divider } from 'antd';
import { SendOutlined, MessageOutlined } from '@ant-design/icons';
import NotificationsDropdown from './NotificationsDropdown';

const { Text } = Typography;

interface ChatInterfaceProps {
  orderId: string;
  currentUserId: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ orderId, currentUserId }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load chat participants
    const loadParticipants = async () => {
      const participants = await chatService.getChatParticipants(orderId);
      setParticipants(participants);
    };
    loadParticipants();

    // Subscribe to chat messages
    const unsubscribeChat = chatService.subscribeToChat(orderId, (newMessages) => {
      setMessages(newMessages.map(msg => chatService.formatMessage(msg, currentUserId)));
    });

    // Subscribe to notifications
    const unsubscribeNotifications = notificationService.subscribeToNotifications(
      currentUserId,
      (newNotifications) => {
        setNotifications(newNotifications);
      }
    );

    return () => {
      unsubscribeChat();
      unsubscribeNotifications();
    };
  }, [orderId, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await chatService.sendMessage(
        orderId,
        currentUserId,
        participants?.vendor.id || 'vendor1',
        newMessage.trim()
      );
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleNotificationClick = (notification: any) => {
    // Handle notification click (e.g., navigate to order, mark as read, etc.)
    if (!notification.isRead) {
      notificationService.markAsRead(notification.id);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
      <Space direction="vertical" size="middle">
        {/* Notifications Dropdown */}
        <NotificationsDropdown
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
        />

        {/* Chat Button */}
        <Button
          type="primary"
          shape="circle"
          icon={<MessageOutlined />}
          size="large"
          onClick={() => setIsChatOpen(!isChatOpen)}
        />

        {/* Chat Window */}
        {isChatOpen && (
          <Card
            title="Order Chat"
            style={{ width: 350, height: 500 }}
            extra={
              <Button type="text" onClick={() => setIsChatOpen(false)}>
                ×
              </Button>
            }
          >
            <div style={{ height: 'calc(100% - 100px)', overflowY: 'auto' }}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: message.isFromCurrentUser ? 'flex-end' : 'flex-start',
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: '8px 12px',
                      borderRadius: 12,
                      backgroundColor: message.isFromCurrentUser ? '#1890ff' : '#f0f0f0',
                      color: message.isFromCurrentUser ? 'white' : 'black',
                    }}
                  >
                    <Text>{message.message}</Text>
                    <div style={{ fontSize: '0.75em', opacity: 0.7, textAlign: 'right' }}>
                      {message.formattedTime}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <Divider style={{ margin: '12px 0' }} />

            <Space.Compact style={{ width: '100%' }}>
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onPressEnter={handleSendMessage}
              />
              <Button type="primary" onClick={handleSendMessage}>
                <SendOutlined />
              </Button>
            </Space.Compact>
          </Card>
        )}
      </Space>
    </div>
  );
};

export default ChatInterface; 