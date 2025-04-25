import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Typography,
  Avatar,
  Badge,
  Tooltip,
  Popconfirm,
  Tabs
} from 'antd';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { formatDate } from '../utils/formatters';
import { UserRole } from '../types/user';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface SupportTicket {
  id: string;
  subject: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category: 'ORDER' | 'PAYMENT' | 'DELIVERY' | 'ACCOUNT' | 'OTHER';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  assignedToName?: string;
  userName: string;
  userEmail: string;
}

interface SupportMessage {
  id: string;
  message: string;
  createdAt: string;
  userName: string;
  userRole: UserRole;
}

const SupportDashboard: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNewTicketModalVisible, setIsNewTicketModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { user } = useAuth();

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/support/tickets');
      setTickets(response.data);
    } catch (error) {
      message.error('Failed to fetch support tickets');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (ticketId: string) => {
    try {
      const response = await api.get(`/support/tickets/${ticketId}`);
      setMessages(response.data.messages);
    } catch (error) {
      message.error('Failed to fetch messages');
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleTicketClick = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    fetchMessages(ticket.id);
    setIsModalVisible(true);
  };

  const handleNewTicket = async (values: any) => {
    try {
      await api.post('/support/tickets', values);
      message.success('Support ticket created successfully');
      setIsNewTicketModalVisible(false);
      fetchTickets();
    } catch (error) {
      message.error('Failed to create support ticket');
    }
  };

  const handleSendMessage = async (values: { message: string }) => {
    if (!selectedTicket) return;

    try {
      await api.post(`/support/tickets/${selectedTicket.id}/messages`, {
        message: values.message
      });
      message.success('Message sent successfully');
      fetchMessages(selectedTicket.id);
    } catch (error) {
      message.error('Failed to send message');
    }
  };

  const handleAssignTicket = async (agentId: string, agentName: string) => {
    if (!selectedTicket) return;

    try {
      await api.post(`/support/tickets/${selectedTicket.id}/assign`, {
        agentId,
        agentName
      });
      message.success('Ticket assigned successfully');
      fetchTickets();
    } catch (error) {
      message.error('Failed to assign ticket');
    }
  };

  const handleResolveTicket = async (resolution: string) => {
    if (!selectedTicket) return;

    try {
      await api.post(`/support/tickets/${selectedTicket.id}/resolve`, {
        resolution
      });
      message.success('Ticket resolved successfully');
      fetchTickets();
    } catch (error) {
      message.error('Failed to resolve ticket');
    }
  };

  const getPriorityColor = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'LOW': return 'green';
      case 'MEDIUM': return 'blue';
      case 'HIGH': return 'orange';
      case 'URGENT': return 'red';
      default: return 'default';
    }
  };

  const getStatusColor = (status: SupportTicket['status']) => {
    switch (status) {
      case 'OPEN': return 'blue';
      case 'IN_PROGRESS': return 'orange';
      case 'RESOLVED': return 'green';
      case 'CLOSED': return 'gray';
      default: return 'default';
    }
  };

  const columns = [
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (text: string, record: SupportTicket) => (
        <Button type="link" onClick={() => handleTicketClick(record)}>
          {text}
        </Button>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: SupportTicket['status']) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      )
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: SupportTicket['priority']) => (
        <Tag color={getPriorityColor(priority)}>{priority}</Tag>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category'
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatDate(date)
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedToName',
      key: 'assignedToName'
    }
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={2}>Support Dashboard</Title>
        </Col>
        <Col>
          <Button type="primary" onClick={() => setIsNewTicketModalVisible(true)}>
            Create New Ticket
          </Button>
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={tickets}
          loading={loading}
          rowKey="id"
        />
      </Card>

      <Modal
        title="Support Ticket"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedTicket && (
          <>
            <Card>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Title level={4}>{selectedTicket.subject}</Title>
                <Space>
                  <Tag color={getStatusColor(selectedTicket.status)}>
                    {selectedTicket.status}
                  </Tag>
                  <Tag color={getPriorityColor(selectedTicket.priority)}>
                    {selectedTicket.priority}
                  </Tag>
                  <Tag>{selectedTicket.category}</Tag>
                </Space>
                <Text>Created by: {selectedTicket.userName}</Text>
                <Text>Email: {selectedTicket.userEmail}</Text>
                <Text>Created: {formatDate(selectedTicket.createdAt)}</Text>
              </Space>
            </Card>

            <Card title="Messages" style={{ marginTop: 16 }}>
              <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                {messages.map((msg) => (
                  <div key={msg.id} style={{ marginBottom: 16 }}>
                    <Space>
                      <Avatar>{msg.userName[0]}</Avatar>
                      <div>
                        <Text strong>{msg.userName}</Text>
                        <Text type="secondary" style={{ marginLeft: 8 }}>
                          {formatDate(msg.createdAt)}
                        </Text>
                        <div>{msg.message}</div>
                      </div>
                    </Space>
                  </div>
                ))}
              </div>

              <Form onFinish={handleSendMessage} style={{ marginTop: 16 }}>
                <Form.Item name="message" rules={[{ required: true }]}>
                  <TextArea rows={4} placeholder="Type your message..." />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Send Message
                  </Button>
                </Form.Item>
              </Form>
            </Card>

            {['ADMIN', 'SUPPORT_MANAGER'].includes(user?.role || '') && (
              <Card title="Actions" style={{ marginTop: 16 }}>
                <Space>
                  <Button
                    type="primary"
                    onClick={() => handleAssignTicket(user?.id || '', user?.name || '')}
                  >
                    Assign to Me
                  </Button>
                  <Button
                    type="primary"
                    danger
                    onClick={() => handleResolveTicket('Resolved by support agent')}
                  >
                    Resolve Ticket
                  </Button>
                </Space>
              </Card>
            )}
          </>
        )}
      </Modal>

      <Modal
        title="Create New Support Ticket"
        visible={isNewTicketModalVisible}
        onCancel={() => setIsNewTicketModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleNewTicket} layout="vertical">
          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="LOW">Low</Select.Option>
              <Select.Option value="MEDIUM">Medium</Select.Option>
              <Select.Option value="HIGH">High</Select.Option>
              <Select.Option value="URGENT">Urgent</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="ORDER">Order</Select.Option>
              <Select.Option value="PAYMENT">Payment</Select.Option>
              <Select.Option value="DELIVERY">Delivery</Select.Option>
              <Select.Option value="ACCOUNT">Account</Select.Option>
              <Select.Option value="OTHER">Other</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Create Ticket
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SupportDashboard; 