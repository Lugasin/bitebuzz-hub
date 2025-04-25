import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Space, 
  message,
  Popconfirm,
  Tag
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const { Option } = Select;

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  restaurantId?: number;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { user } = useAuth();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (values: any) => {
    try {
      await api.post('/users', values);
      message.success('User created successfully');
      setVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      message.error('Failed to create user');
    }
  };

  const handleUpdate = async (values: any) => {
    if (!editingUser) return;
    try {
      await api.put(`/users/${editingUser.id}`, values);
      message.success('User updated successfully');
      setVisible(false);
      setEditingUser(null);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      message.error('Failed to update user');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/users/${id}`);
      message.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const showModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      form.setFieldsValue(user);
    } else {
      setEditingUser(null);
      form.resetFields();
    }
    setVisible(true);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'red';
      case 'admin':
        return 'blue';
      case 'restaurant_agent':
        return 'green';
      case 'delivery_agent':
        return 'orange';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={getRoleColor(role)}>
          {role.replace('_', ' ').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: User) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            disabled={record.role === 'super_admin' && user?.role !== 'super_admin'}
          />
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            disabled={record.role === 'super_admin' && user?.role !== 'super_admin'}
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              disabled={record.role === 'super_admin' && user?.role !== 'super_admin'}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Add User
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title={editingUser ? 'Edit User' : 'Create User'}
        visible={visible}
        onCancel={() => {
          setVisible(false);
          setEditingUser(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingUser ? handleUpdate : handleCreate}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input the email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select a role!' }]}
          >
            <Select>
              {user?.role === 'super_admin' && (
                <Option value="super_admin">Super Admin</Option>
              )}
              <Option value="admin">Admin</Option>
              <Option value="restaurant_agent">Restaurant Agent</Option>
              <Option value="delivery_agent">Delivery Agent</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="restaurantId"
            label="Restaurant"
            dependencies={['role']}
          >
            <Select
              disabled={form.getFieldValue('role') !== 'restaurant_agent'}
            >
              {/* Add restaurant options here */}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement; 