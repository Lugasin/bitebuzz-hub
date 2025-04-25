import React, { useEffect, useState } from 'react';
import { Card, Timeline, Tag, Space, Button, message } from 'antd';
import { useAuth } from '../context/AuthContext';
import { OrderStatus } from '../types/order';
import { wsClient } from '../services/websocket';

interface OrderTrackingProps {
  orderId: number;
  initialStatus: OrderStatus;
  onStatusChange?: (status: OrderStatus) => void;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({
  orderId,
  initialStatus,
  onStatusChange
}) => {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const subscription = wsClient.subscribe(`/topic/orders/${orderId}`, (message) => {
      const data = JSON.parse(message.body);
      if (data.type === 'STATUS_UPDATE') {
        setStatus(data.status);
        onStatusChange?.(data.status);
      } else if (data.type === 'LOCATION_UPDATE') {
        setLocation(data.location);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [orderId]);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 'orange';
      case 'CONFIRMED':
        return 'blue';
      case 'PREPARING':
        return 'purple';
      case 'READY_FOR_PICKUP':
        return 'cyan';
      case 'PICKED_UP':
        return 'geekblue';
      case 'IN_TRANSIT':
        return 'gold';
      case 'DELIVERED':
        return 'green';
      case 'CANCELLED':
        return 'red';
      default:
        return 'default';
    }
  };

  const statusTimeline = [
    { status: 'PENDING', label: 'Order Placed' },
    { status: 'CONFIRMED', label: 'Order Confirmed' },
    { status: 'PREPARING', label: 'Preparing Food' },
    { status: 'READY_FOR_PICKUP', label: 'Ready for Pickup' },
    { status: 'PICKED_UP', label: 'Picked Up' },
    { status: 'IN_TRANSIT', label: 'In Transit' },
    { status: 'DELIVERED', label: 'Delivered' }
  ];

  return (
    <Card title="Order Tracking">
      <Timeline>
        {statusTimeline.map((item) => (
          <Timeline.Item
            key={item.status}
            color={status === item.status ? getStatusColor(status) : 'gray'}
          >
            <Space>
              <span>{item.label}</span>
              {status === item.status && (
                <Tag color={getStatusColor(status)}>
                  {status.replace('_', ' ')}
                </Tag>
              )}
            </Space>
          </Timeline.Item>
        ))}
      </Timeline>

      {location && (
        <div style={{ marginTop: 16 }}>
          <h4>Current Location</h4>
          <p>Latitude: {location.lat}</p>
          <p>Longitude: {location.lng}</p>
        </div>
      )}

      {user?.role === 'DELIVERY_AGENT' && status === 'IN_TRANSIT' && (
        <Button
          type="primary"
          onClick={() => {
            // Update delivery location
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const newLocation = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                };
                wsClient.publish({
                  destination: `/app/orders/${orderId}/location`,
                  body: JSON.stringify(newLocation)
                });
              },
              (error) => {
                message.error('Failed to get location');
              }
            );
          }}
        >
          Update Location
        </Button>
      )}
    </Card>
  );
};

export default OrderTracking; 