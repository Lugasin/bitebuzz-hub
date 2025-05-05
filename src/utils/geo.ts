
// A simple utility for geographical distance calculations

interface Location {
  latitude: number;
  longitude: number;
}

/**
 * Calculate the distance between two geographical points
 * This is a simplified implementation for demonstration purposes
 * A real implementation would use the Haversine formula or similar
 */
export const calculateDistance = (point1: Location, point2: Location): number => {
  // Simple Euclidean distance - not accurate for real geo coordinates
  // but sufficient for demonstration and testing purposes
  const latDiff = point1.latitude - point2.latitude;
  const longDiff = point1.longitude - point2.longitude;
  
  // Return distance in arbitrary units
  // In a real app, this would return kilometers or miles
  return Math.sqrt(latDiff * latDiff + longDiff * longDiff);
};

/**
 * Check if a location is within a certain radius of another location
 */
export const isWithinRadius = (
  center: Location,
  point: Location,
  radiusKm: number
): boolean => {
  const distance = calculateDistance(center, point);
  return distance <= radiusKm;
};

/**
 * Calculate the estimated travel time between two points
 * @param point1 Starting location
 * @param point2 Destination location
 * @param speedKmh Average speed in km/h
 * @returns Estimated travel time in minutes
 */
export const calculateEstimatedTravelTime = (
  point1: Location,
  point2: Location,
  speedKmh: number = 30
): number => {
  const distanceKm = calculateDistance(point1, point2);
  const timeHours = distanceKm / speedKmh;
  return timeHours * 60; // Convert hours to minutes
};
