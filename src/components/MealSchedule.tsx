import React, { useState } from 'react';
import { Card, Typography, Button, TimePicker, DatePicker, Select, Form, message } from 'antd';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { MenuItem } from '../services/menuService';
import { useAuth } from '../contexts/AuthContext';

const { Title, Text } = Typography;
const { RangePicker } = TimePicker;

interface MealScheduleProps {
  selectedItems: MenuItem[];
  onScheduleComplete?: () => void;
}

const MealSchedule: React.FC<MealScheduleProps> = ({ selectedItems, onScheduleComplete }) => {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSchedule = async (values: any) => {
    if (!user) {
      message.error('Please log in to schedule meals');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          items: selectedItems,
          schedule: values
        })
      });

      if (!response.ok) {
        throw new Error('Failed to schedule meals');
      }

      message.success('Meals scheduled successfully');
      if (onScheduleComplete) {
        onScheduleComplete();
      }
    } catch (error) {
      console.error('Error scheduling meals:', error);
      message.error('Failed to schedule meals');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="schedule-container">
      <Title level={3}>
        <CalendarOutlined /> Schedule Your Meals
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSchedule}
        initialValues={{
          frequency: 'daily',
          deliveryTime: '12:00'
        }}
      >
        <Form.Item
          name="startDate"
          label="Start Date"
          rules={[{ required: true, message: 'Please select a start date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="endDate"
          label="End Date"
          rules={[{ required: true, message: 'Please select an end date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="frequency"
          label="Frequency"
          rules={[{ required: true, message: 'Please select frequency' }]}
        >
          <Select>
            <Select.Option value="daily">Daily</Select.Option>
            <Select.Option value="weekly">Weekly</Select.Option>
            <Select.Option value="weekdays">Weekdays Only</Select.Option>
            <Select.Option value="weekends">Weekends Only</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="deliveryTime"
          label="Preferred Delivery Time"
          rules={[{ required: true, message: 'Please select delivery time' }]}
        >
          <TimePicker format="HH:mm" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="deliveryAddress"
          label="Delivery Address"
          rules={[{ required: true, message: 'Please enter delivery address' }]}
        >
          <Select>
            <Select.Option value="home">Home Address</Select.Option>
            <Select.Option value="work">Work Address</Select.Option>
            <Select.Option value="other">Other Address</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Schedule Meals
          </Button>
        </Form.Item>
      </Form>

      <div className="selected-items">
        <Title level={4}>Selected Items</Title>
        {selectedItems.map(item => (
          <div key={item.id} className="selected-item">
            <Text strong>{item.name}</Text>
            <Text type="secondary">K{item.price.toFixed(2)}</Text>
          </div>
        ))}
      </div>

      <style jsx>{`
        .schedule-container {
          max-width: 600px;
          margin: 0 auto;
        }
        .selected-items {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #f0f0f0;
        }
        .selected-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
      `}</style>
    </Card>
  );
};

export default MealSchedule; 