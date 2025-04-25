import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  DatePicker,
  Select,
  Spin,
  message,
  Tabs,
  Progress,
  Tooltip,
  Typography,
  Button
} from 'antd';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons';
import { formatCurrency, formatTime } from '../utils/formatters';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface AnalyticsData {
  dailyOrders: Array<{
    date: string;
    count: number;
    revenue: number;
  }>;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  orderStatus: Array<{
    status: string;
    count: number;
  }>;
  summary: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    completionRate: number;
    averageDeliveryTime: number;
    customerSatisfaction: number;
  };
  peakHours: Array<{
    hour: number;
    orders: number;
  }>;
  deliveryPerformance: {
    averageTime: number;
    onTimeRate: number;
    lateRate: number;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AnalyticsDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<[string, string]>(['', '']);
  const [restaurantId, setRestaurantId] = useState<string>('');
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [startDate, endDate] = timeRange;
      const response = await api.get('/analytics', {
        params: {
          startDate,
          endDate,
          restaurantId: user?.role === 'RESTAURANT_AGENT' ? user.restaurantId : restaurantId
        }
      });
      setData(response.data);
    } catch (error) {
      message.error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeRange[0] && timeRange[1]) {
      fetchAnalytics();
    }
  }, [timeRange, restaurantId]);

  const handleExport = () => {
    // Implement export functionality
    message.success('Exporting analytics data...');
  };

  const renderOverview = () => (
    <>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={data?.summary.totalOrders}
              prefix={<Text type="secondary">📦</Text>}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={data?.summary.totalRevenue}
              prefix="$"
              precision={2}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Average Order Value"
              value={data?.summary.averageOrderValue}
              prefix="$"
              precision={2}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Customer Satisfaction"
              value={data?.summary.customerSatisfaction}
              precision={1}
              suffix="/5"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card title="Daily Orders & Revenue">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data?.dailyOrders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <RechartsTooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  name="Orders"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#82ca9d"
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Delivery Performance">
            <Row gutter={16}>
              <Col span={12}>
                <Progress
                  type="circle"
                  percent={data?.deliveryPerformance.onTimeRate}
                  format={percent => `${percent}%`}
                  status="active"
                />
                <Text>On-Time Delivery Rate</Text>
              </Col>
              <Col span={12}>
                <Progress
                  type="circle"
                  percent={data?.summary.completionRate}
                  format={percent => `${percent}%`}
                  status="success"
                />
                <Text>Order Completion Rate</Text>
              </Col>
            </Row>
            <Row style={{ marginTop: 16 }}>
              <Col span={24}>
                <Text>Average Delivery Time: {formatTime(data?.deliveryPerformance.averageTime)}</Text>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );

  const renderProducts = () => (
    <Card title="Top Products">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data?.topProducts}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <RechartsTooltip />
          <Legend />
          <Bar dataKey="sales" fill="#8884d8" name="Sales" />
          <Bar dataKey="revenue" fill="#82ca9d" name="Revenue" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );

  const renderPeakHours = () => (
    <Card title="Peak Hours Analysis">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data?.peakHours}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <RechartsTooltip />
          <Legend />
          <Bar dataKey="orders" fill="#8884d8" name="Orders" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={2}>Analytics Dashboard</Title>
        </Col>
        <Col>
          <Button
            icon={<DownloadOutlined />}
            onClick={handleExport}
            style={{ marginRight: 8 }}
          >
            Export
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchAnalytics}
            loading={loading}
          >
            Refresh
          </Button>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <RangePicker
            onChange={(dates) => {
              if (dates) {
                setTimeRange([
                  dates[0]?.format('YYYY-MM-DD') || '',
                  dates[1]?.format('YYYY-MM-DD') || ''
                ]);
              }
            }}
          />
        </Col>
        {user?.role === 'ADMIN' && (
          <Col span={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="Select Restaurant"
              onChange={setRestaurantId}
            >
              {/* Add restaurant options here */}
            </Select>
          </Col>
        )}
      </Row>

      {loading ? (
        <Spin size="large" />
      ) : data ? (
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Overview" key="overview">
            {renderOverview()}
          </TabPane>
          <TabPane tab="Products" key="products">
            {renderProducts()}
          </TabPane>
          <TabPane tab="Peak Hours" key="peakHours">
            {renderPeakHours()}
          </TabPane>
        </Tabs>
      ) : (
        <Card>
          <p>Select a date range to view analytics</p>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsDashboard; 