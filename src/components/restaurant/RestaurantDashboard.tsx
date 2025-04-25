import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Table, 
  Button, 
  Tag,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Upload,
  message
} from 'antd';
import { 
  ShoppingCartOutlined, 
  DollarOutlined, 
  ClockCircleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

interface Order {
  id: number;
  customerName: string;
  items: string[];
  total: number;
  status: string;
  createdAt: string;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
}

const RestaurantDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
    fetchMenuItems();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/restaurants/${user?.restaurantId}/orders`);
      setOrders(response.data);
    } catch (error) {
      message.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/restaurants/${user?.restaurantId}/menu`);
      setMenuItems(response.data);
    } catch (error) {
      message.error('Failed to fetch menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      message.success('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      message.error('Failed to update order status');
    }
  };

  const handleAddMenuItem = async (values: any) => {
    try {
      await api.post(`/restaurants/${user?.restaurantId}/menu`, values);
      message.success('Menu item added successfully');
      setMenuModalVisible(false);
      form.resetFields();
      fetchMenuItems();
    } catch (error) {
      message.error('Failed to add menu item');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'preparing':
        return 'blue';
      case 'ready':
        return 'green';
      case 'delivered':
        return 'purple';
      default:
        return 'default';
    }
  };

  const orderColumns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items: string[]) => items.join(', '),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => `$${total.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Order) => (
        <Space>
          <Button
            type="primary"
            onClick={() => handleUpdateOrderStatus(record.id, 'preparing')}
            disabled={record.status !== 'pending'}
          >
            Start Preparing
          </Button>
          <Button
            type="primary"
            onClick={() => handleUpdateOrderStatus(record.id, 'ready')}
            disabled={record.status !== 'preparing'}
          >
            Mark as Ready
          </Button>
        </Space>
      ),
    },
  ];

  const menuColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Status',
      dataIndex: 'isAvailable',
      key: 'isAvailable',
      render: (isAvailable: boolean) => (
        <Tag color={isAvailable ? 'green' : 'red'}>
          {isAvailable ? 'Available' : 'Unavailable'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: MenuItem) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              form.setFieldsValue(record);
              setMenuModalVisible(true);
            }}
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteMenuItem(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Today's Orders"
              value={orders.length}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={orders.reduce((sum, order) => sum + order.total, 0)}
              prefix={<DollarOutlined />}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Average Preparation Time"
              value="25"
              suffix="min"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Menu Management"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setMenuModalVisible(true);
            }}
          >
            Add Menu Item
          </Button>
        }
      >
        <Table
          columns={menuColumns}
          dataSource={menuItems}
          loading={loading}
          rowKey="id"
        />
      </Card>

      <Card title="Recent Orders" style={{ marginTop: 24 }}>
        <Table
          columns={orderColumns}
          dataSource={orders}
          loading={loading}
          rowKey="id"
        />
      </Card>

      <Modal
        title="Add Menu Item"
        visible={menuModalVisible}
        onCancel={() => {
          setMenuModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddMenuItem}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input the description!' }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please input the price!' }]}
          >
            <InputNumber
              min={0}
              step={0.01}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please input the category!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="image"
            label="Image"
            valuePropName="fileList"
          >
            <Upload
              listType="picture-card"
              maxCount={1}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RestaurantDashboard; 