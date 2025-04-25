import React, { useEffect, useState, useRef } from 'react';
import { Map, Marker, Popup, TileLayer, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, Typography, Space, Spin, List } from 'antd';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { routeService } from '../lib/routeService';

const { Text } = Typography;

interface TrackingMapProps {
  orderId: string;
  driverId: string;
}

const TrackingMap: React.FC<TrackingMapProps> = ({ orderId, driverId }) => {
  const [driverLocation, setDriverLocation] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [route, setRoute] = useState<any>(null);
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    // Subscribe to driver's location updates
    const unsubscribe = onSnapshot(doc(db, 'driver_locations', driverId), (doc) => {
      const data = doc.data();
      if (data && data.location) {
        setDriverLocation([data.location.latitude, data.location.longitude]);
        setIsLoading(false);
      }
    });

    // Get optimized route
    const loadRoute = async () => {
      try {
        const optimizedRoute = await routeService.getOptimizedRoute(driverId);
        setRoute(optimizedRoute);
      } catch (error) {
        console.error('Error loading route:', error);
      }
    };

    loadRoute();

    return () => unsubscribe();
  }, [driverId]);

  useEffect(() => {
    if (driverLocation && mapRef.current) {
      mapRef.current.setView(driverLocation, 15);
    }
  }, [driverLocation]);

  const driverIcon = L.icon({
    iconUrl: '/delivery-bike.png',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

  const deliveryIcon = L.icon({
    iconUrl: '/delivery-point.png',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  const pickupIcon = L.icon({
    iconUrl: '/pickup-point.png',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  return (
    <Card
      title="Delivery Tracking"
      style={{ height: '100%' }}
      extra={
        <Space>
          <Text type="secondary">Order ID: {orderId}</Text>
          {isLoading && <Spin size="small" />}
        </Space>
      }
    >
      <div style={{ height: '400px', width: '100%', position: 'relative' }}>
        {isLoading ? (
          <div style={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)' 
          }}>
            <Spin size="large" />
          </div>
        ) : (
          <Map
            center={driverLocation || [0, 0]}
            zoom={15}
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* Show route if available */}
            {route && route.waypoints.length > 1 && (
              <Polyline
                positions={route.waypoints.map((point: any) => [point.latitude, point.longitude])}
                color="#1890ff"
                weight={3}
                opacity={0.7}
              />
            )}

            {/* Show delivery points */}
            {route?.points.map((point: any) => (
              <Marker
                key={point.id}
                position={[point.location.latitude, point.location.longitude]}
                icon={point.type === 'pickup' ? pickupIcon : deliveryIcon}
              >
                <Popup>
                  <Space direction="vertical">
                    <Text strong>{point.type === 'pickup' ? 'Pickup' : 'Delivery'} Point</Text>
                    <Text type="secondary">{point.address}</Text>
                    <Text type="secondary">Order: {point.orderId}</Text>
                    {point.timeWindow && (
                      <Text type="secondary">
                        Time Window: {point.timeWindow.start.toLocaleTimeString()} - {point.timeWindow.end.toLocaleTimeString()}
                      </Text>
                    )}
                  </Space>
                </Popup>
              </Marker>
            ))}

            {/* Show driver location */}
            {driverLocation && (
              <Marker position={driverLocation} icon={driverIcon}>
                <Popup>
                  <Space direction="vertical">
                    <Text strong>Delivery Driver</Text>
                    <Text type="secondary">Order: {orderId}</Text>
                    <Text type="secondary">
                      Last updated: {new Date().toLocaleTimeString()}
                    </Text>
                    {route && (
                      <Text type="secondary">
                        Estimated time to next stop: {Math.round(route.estimatedTime)} minutes
                      </Text>
                    )}
                  </Space>
                </Popup>
              </Marker>
            )}
          </Map>
        )}
      </div>

      {/* Route details */}
      {route && (
        <List
          style={{ marginTop: 16 }}
          header={<Text strong>Route Details</Text>}
          bordered
          dataSource={route.points}
          renderItem={(point: any) => (
            <List.Item>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text strong>{point.type === 'pickup' ? 'Pickup' : 'Delivery'} - Order {point.orderId}</Text>
                <Text type="secondary">{point.address}</Text>
                {point.timeWindow && (
                  <Text type="secondary">
                    Time Window: {point.timeWindow.start.toLocaleTimeString()} - {point.timeWindow.end.toLocaleTimeString()}
                  </Text>
                )}
              </Space>
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default TrackingMap; 