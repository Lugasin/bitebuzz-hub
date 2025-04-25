import React, { useEffect, useState } from 'react';
import { Button, Card, Typography, Space, Alert } from 'antd';
import { MyLocationOutlined, LocationOffOutlined } from '@ant-design/icons';
import { driverLocationService } from '../lib/driverLocationService';

const { Text } = Typography;

interface DriverLocationUpdaterProps {
  driverId: string;
}

const DriverLocationUpdater: React.FC<DriverLocationUpdaterProps> = ({ driverId }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const watchId = React.useRef<number | null>(null);

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        driverLocationService.updateDriverLocation(driverId, { latitude, longitude })
          .then(() => {
            setLastUpdate(new Date());
            setError(null);
          })
          .catch((err) => {
            setError('Failed to update location: ' + err.message);
          });
      },
      (err) => {
        setError('Error getting location: ' + err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );

    setIsTracking(true);
  };

  const stopTracking = () => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }

    driverLocationService.setDriverInactive(driverId)
      .then(() => {
        setIsTracking(false);
        setError(null);
      })
      .catch((err) => {
        setError('Failed to stop tracking: ' + err.message);
      });
  };

  useEffect(() => {
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  return (
    <Card
      title="Location Tracking"
      style={{ marginBottom: 16 }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
          />
        )}

        <Space>
          <Button
            type={isTracking ? 'default' : 'primary'}
            icon={isTracking ? <LocationOffOutlined /> : <MyLocationOutlined />}
            onClick={isTracking ? stopTracking : startTracking}
          >
            {isTracking ? 'Stop Tracking' : 'Start Tracking'}
          </Button>

          {lastUpdate && (
            <Text type="secondary">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </Text>
          )}
        </Space>

        <Text type="secondary">
          {isTracking
            ? 'Your location is being tracked in real-time'
            : 'Click "Start Tracking" to begin sharing your location'}
        </Text>
      </Space>
    </Card>
  );
};

export default DriverLocationUpdater; 