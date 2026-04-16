/**
 * Distance Calculation Utilities
 * Haversine formula for distance between coordinates
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

const EARTH_RADIUS_KM = 6371;

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param start Starting coordinates (lat, lon)
 * @param end Ending coordinates (lat, lon)
 * @returns Distance in kilometers
 */
export function calculateDistance(start: Coordinates, end: Coordinates): number {
  const dLat = toRadians(end.latitude - start.latitude);
  const dLon = toRadians(end.longitude - start.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(start.latitude)) *
      Math.cos(toRadians(end.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/**
 * Calculate estimated travel time in minutes
 * Assumes average speed of 40 km/h (urban riding)
 * Minimum 1 minute for very close distances
 */
export function estimateTravelTime(distanceKm: number): number {
  const averageSpeedKmH = 40;
  const timeInMinutes = (distanceKm / averageSpeedKmH) * 60;
  return Math.max(1, Math.ceil(timeInMinutes));
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Check if a driver is within pickup radius
 */
export function isWithinPickupRadius(
  driverLocation: Coordinates,
  pickupLocation: Coordinates,
  radiusKm: number = 5
): boolean {
  const distance = calculateDistance(driverLocation, pickupLocation);
  return distance <= radiusKm;
}
