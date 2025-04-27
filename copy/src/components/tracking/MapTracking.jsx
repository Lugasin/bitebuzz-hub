
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Navigation, Clock } from "lucide-react";

// Temporary Mapbox token - in production, use env variables or Supabase secrets
const MAPBOX_TOKEN = "pk.eyJ1IjoibG92YWJsZS1kZXYiLCJhIjoiY2xyeDF4bGZ4MGYxYTJqbmZ1YjE0b3ZrOCJ9.Jh5yMrch7wdPpBx4FpHl6Q";

const MapTracking = ({ 
  deliveryLocation = { lat: -15.3875, lng: 28.3228 }, // Default: Lusaka
  restaurantLocation = { lat: -15.4007, lng: 28.3194 },
  driverLocation = { lat: -15.3942, lng: 28.3211 },
  estimatedTime = "25-35 min",
  distance = "5.2 km"
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showMapInput, setShowMapInput] = useState(false);
  const [mapboxToken, setMapboxToken] = useState(MAPBOX_TOKEN);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Handle case where token isn't provided
    if (!mapboxToken) {
      setShowMapInput(true);
      return;
    }

    mapboxgl.accessToken = mapboxToken;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [driverLocation.lng, driverLocation.lat],
        zoom: 13,
      });

      map.current.on('load', () => {
        setMapLoaded(true);
        
        // Add restaurant marker
        new mapboxgl.Marker({ color: '#FF6B00' })
          .setLngLat([restaurantLocation.lng, restaurantLocation.lat])
          .addTo(map.current)
          .setPopup(new mapboxgl.Popup().setHTML("<h3>Restaurant</h3>"));
          
        // Add delivery location marker
        new mapboxgl.Marker({ color: '#4A6DFF' })
          .setLngLat([deliveryLocation.lng, deliveryLocation.lat])
          .addTo(map.current)
          .setPopup(new mapboxgl.Popup().setHTML("<h3>Delivery Location</h3>"));
          
        // Add driver marker
        new mapboxgl.Marker({ color: '#10B981' })
          .setLngLat([driverLocation.lng, driverLocation.lat])
          .addTo(map.current)
          .setPopup(new mapboxgl.Popup().setHTML("<h3>Driver</h3>"));

        // Get route from restaurant to delivery location
        getRoute(map.current, [restaurantLocation.lng, restaurantLocation.lat], 
                 [deliveryLocation.lng, deliveryLocation.lat]);
        
        // Simulate driver movement along the route
        simulateDriverMovement();
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    } catch (error) {
      console.error("Error initializing map:", error);
      setShowMapInput(true);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken]);

  // Function to fetch and display the route
  const getRoute = async (map, start, end) => {
    try {
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxToken}`
      );
      
      const json = await query.json();
      
      if (json.routes && json.routes.length > 0) {
        const data = json.routes[0];
        const route = data.geometry.coordinates;
        
        // Add route layer if it doesn't exist
        if (!map.getSource('route')) {
          map.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: route
              }
            }
          });
          
          map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#10B981',
              'line-width': 5,
              'line-opacity': 0.75
            }
          });
        } else {
          // Update existing route
          map.getSource('route').setData({
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: route
            }
          });
        }
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  // Simulate driver movement (in a real app, this would use WebSockets/real-time DB)
  const simulateDriverMovement = () => {
    // In a real app, this would subscribe to location updates from Firebase
    // For demo purposes, we're just moving the driver marker slightly every few seconds
    let counter = 0;
    const maxSteps = 10;
    
    const interval = setInterval(() => {
      if (!map.current || counter >= maxSteps) {
        clearInterval(interval);
        return;
      }
      
      // Move driver toward delivery location
      const newLat = driverLocation.lat + (deliveryLocation.lat - driverLocation.lat) * (counter / maxSteps);
      const newLng = driverLocation.lng + (deliveryLocation.lng - driverLocation.lng) * (counter / maxSteps);
      
      // Update driver marker
      const markers = document.querySelectorAll('.mapboxgl-marker');
      if (markers.length >= 3) {
        // The third marker is the driver (green one)
        const driverMarker = markers[2];
        driverMarker.style.transform = `translate(${map.current.project([newLng, newLat]).x}px, ${map.current.project([newLng, newLat]).y}px)`;
      }
      
      counter++;
    }, 2000);
  };

  // Handle Mapbox token input
  const handleTokenSubmit = (e) => {
    e.preventDefault();
    const token = e.target.elements.token.value;
    if (token) {
      setMapboxToken(token);
      setShowMapInput(false);
    }
  };

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
      {showMapInput ? (
        <Card className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-secondary/50">
          <h3 className="text-lg font-semibold mb-4">Mapbox Token Required</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            To display the live tracking map, please enter your Mapbox public token:
          </p>
          <form onSubmit={handleTokenSubmit} className="w-full max-w-md">
            <input 
              type="text" 
              name="token"
              placeholder="Enter your Mapbox public token"
              className="w-full px-3 py-2 border rounded-md mb-2"
              required
            />
            <Button type="submit" className="w-full">
              Load Map
            </Button>
          </form>
          <p className="mt-4 text-xs text-muted-foreground">
            You can get a token from <a href="https://account.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Mapbox.com</a>
          </p>
        </Card>
      ) : (
        <>
          <div ref={mapContainer} className="absolute inset-0" />
          <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{estimatedTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{distance}</span>
              </div>
              <div className="flex items-center gap-2">
                <Navigation className="h-4 w-4 text-primary" />
                <span className="font-medium text-primary">Live Tracking</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MapTracking;
