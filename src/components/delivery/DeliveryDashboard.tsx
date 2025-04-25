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
  message
} from 'antd';
import { 
  ShoppingCartOutlined, 
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import TrackingMap from '../TrackingMap';

interface DeliveryOrder {
  id: number;
  orderId: number;
  customerName: string;
  customerAddress: string;
  restaurantName: string;
  restaurantAddress: string;
  items: string[];
  total: number;
  status: string;
  createdAt: string;
  estimatedDeliveryTime: string;
}

const DeliveryDashboard: React.FC = () => {
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/delivery/orders');
      setOrders(response.data);
    } catch (error) {
      message.error('Failed to fetch delivery orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: number, status: string) => {
    try {
      await api.put(`/delivery/orders/${orderId}/status`, { status });
      message.success('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      message.error('Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'picked_up':
        return 'blue';
      case 'in_transit':
        return 'purple';
      case 'delivered':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Restaurant',
      dataIndex: 'restaurantName',
      key: 'restaurantName',
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
          {status.replace('_', ' ').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Estimated Delivery',
      dataIndex: 'estimatedDeliveryTime',
      key: 'estimatedDeliveryTime',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: DeliveryOrder) => (
        <Space>
          <Button
            type="primary"
            onClick={() => setSelectedOrder(record)}
          >
            View Route
          </Button>
          {record.status === 'pending' && (
            <Button
              type="primary"
              onClick={() => handleUpdateStatus(record.id, 'picked_up')}
            >
              Pick Up
            </Button>
          )}
          {record.status === 'picked_up' && (
            <Button
              type="primary"
              onClick={() => handleUpdateStatus(record.id, 'in_transit')}
            >
              Start Delivery
            </Button>
          )}
          {record.status === 'in_transit' && (
            <Button
              type="primary"
              onClick={() => handleUpdateStatus(record.id, 'delivered')}
            >
              Mark as Delivered
            </Button>
          )}
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
              title="Active Deliveries"
              value={orders.filter(order => order.status === 'in_transit').length}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Today's Deliveries"
              value={orders.length}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Average Delivery Time"
              value="30"
              suffix="min"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Delivery Orders">
        <Table
          columns={columns}
          dataSource={orders}
          loading={loading}
          rowKey="id"
        />
      </Card>

      <Modal
        title="Delivery Route"
        visible={!!selectedOrder}
        onCancel={() => setSelectedOrder(null)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <TrackingMap
            pickupLocation={selectedOrder.restaurantAddress}
            deliveryLocation={selectedOrder.customerAddress}
            orderId={selectedOrder.orderId}
          />
        )}
      </Modal>
    </div>
  );
};

export default DeliveryDashboard; 