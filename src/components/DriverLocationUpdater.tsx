
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, MapOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Position {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

const DriverLocationUpdater: React.FC = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Update server with current location
  const updateLocation = async (position: GeolocationPosition) => {
    if (!user) return;

    try {
      const { latitude, longitude, accuracy } = position.coords;
      
      setCurrentPosition({
        latitude,
        longitude,
        accuracy,
        timestamp: position.timestamp
      });
      
      setLastUpdateTime(new Date());
      
      const response = await fetch('/api/courier/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          latitude,
          longitude,
          accuracy,
          timestamp: position.timestamp
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update location');
      }
    } catch (error) {
      console.error('Error updating location:', error);
      toast({
        title: 'Error',
        description: 'Failed to update your location',
        variant: 'destructive'
      });
    }
  };

  // Handle location error
  const handleLocationError = (error: GeolocationPositionError) => {
    let errorMessage;
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location permission denied';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information unavailable';
        break;
      case error.TIMEOUT:
        errorMessage = 'Location request timed out';
        break;
      default:
        errorMessage = 'Unknown location error';
    }
    
    toast({
      title: 'Location Error',
      description: errorMessage,
      variant: 'destructive'
    });
    
    stopTracking();
  };

  // Start tracking location
  const startTracking = () => {
    if (!navigator.geolocation) {
      toast({
        title: 'Not Supported',
        description: 'Geolocation is not supported by your browser',
        variant: 'destructive'
      });
      return;
    }
    
    // Get initial position
    navigator.geolocation.getCurrentPosition(updateLocation, handleLocationError);
    
    // Set up continuous tracking
    const id = navigator.geolocation.watchPosition(updateLocation, handleLocationError, {
      enableHighAccuracy: true,
      maximumAge: 30000,
      timeout: 27000
    });
    
    setWatchId(id);
    setIsTracking(true);
    
    toast({
      title: 'Tracking Started',
      description: 'Your location is now being tracked'
    });
  };

  // Stop tracking location
  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsTracking(false);
      
      toast({
        title: 'Tracking Stopped',
        description: 'Your location is no longer being tracked'
      });
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  if (!user || user.role !== 'delivery') {
    return null;
  }

  return (
    <Card className="p-4">
      <div className="flex flex-col space-y-4">
        <h2 className="text-xl font-bold">Location Tracker</h2>
        
        {currentPosition && (
          <div className="text-sm">
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Latitude:</span>
              <span>{currentPosition.latitude.toFixed(6)}</span>
              
              <span className="font-medium">Longitude:</span>
              <span>{currentPosition.longitude.toFixed(6)}</span>
              
              <span className="font-medium">Accuracy:</span>
              <span>{currentPosition.accuracy.toFixed(1)} meters</span>
              
              <span className="font-medium">Last Update:</span>
              <span>{lastUpdateTime?.toLocaleTimeString()}</span>
            </div>
          </div>
        )}
        
        <div className="flex">
          {isTracking ? (
            <Button
              variant="destructive"
              onClick={stopTracking}
              className="w-full"
            >
              <MapOff className="mr-2 h-4 w-4" /> Stop Tracking
            </Button>
          ) : (
            <Button
              variant="default"
              onClick={startTracking}
              className="w-full"
            >
              <MapPin className="mr-2 h-4 w-4" /> Start Tracking
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DriverLocationUpdater;
