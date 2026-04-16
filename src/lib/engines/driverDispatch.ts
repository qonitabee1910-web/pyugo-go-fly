/**
 * Driver Dispatch Engine
 * Matches riders with available drivers using proximity and rating
 */

import { Driver, dummyDrivers } from '@/shared/data/dummy';
import { Coordinates, calculateDistance, isWithinPickupRadius, estimateTravelTime } from '@/lib/utils/distance';
import { DispatchMatch, DriverLocation } from '@/lib/types/ride';

export interface DispatchRequest {
  pickupLocation: Coordinates;
  serviceType: 'motor' | 'women' | 'car';
  minRating?: number;
  maxRadius?: number; // km
}

export interface DispatchResult {
  candidates: DispatchMatch[];
  selectedDriver?: DispatchMatch;
  reason: string;
}

/**
 * Find and rank available drivers for dispatch
 */
export function findAvailableDrivers(
  request: DispatchRequest,
  driverLocations: Map<string, DriverLocation> = new Map()
): DispatchResult {
  const { pickupLocation, serviceType, minRating = 4.0, maxRadius = 5 } = request;

  // 1. Filter drivers by service type
  let candidates = filterDriversByServiceType(dummyDrivers, serviceType);

  // 2. Filter by rating
  candidates = candidates.filter(d => d.rating >= minRating);

  // 3. Filter by location proximity and get distance
  const scoredCandidates = candidates
    .map(driver => {
      const driverLocation = driverLocations.get(driver.id) || getDefaultDriverLocation(driver);
      const distance = calculateDistance(driverLocation, pickupLocation);

      if (distance > maxRadius) return null;

      const match: DispatchMatch = {
        driverId: driver.id,
        distanceToPickup: distance,
        estimatedArrival: estimateTravelTime(distance),
        rating: driver.rating,
        score: calculateMatchScore(driver, distance),
      };

      return match;
    })
    .filter((m): m is DispatchMatch => m !== null);

  // 4. Sort by score (highest first) - best matches first
  scoredCandidates.sort((a, b) => b.score - a.score);

  const selectedDriver = scoredCandidates.length > 0 ? scoredCandidates[0] : undefined;

  const reason = getReason(scoredCandidates, serviceType, minRating);

  return {
    candidates: scoredCandidates.slice(0, 5), // Return top 5
    selectedDriver,
    reason,
  };
}

/**
 * Filter drivers by service type
 */
function filterDriversByServiceType(drivers: Driver[], serviceType: string): Driver[] {
  switch (serviceType) {
    case 'women':
      // Women service - only female drivers
      return drivers.filter(d => ['Siti Nurhaliza', 'Dewi Lestari'].includes(d.name));

    case 'car':
      // Car service - only drivers with cars (4-seater vehicles)
      return drivers.filter(d => d.vehicle.includes('Toyota') || d.vehicle.includes('Avanza') || d.vehicle.includes('Innova'));

    case 'motor':
    default:
      // All drivers available for motorcycle service
      return drivers;
  }
}

/**
 * Calculate match score (0-100)
 * Factors: rating (50%), distance (50%)
 */
function calculateMatchScore(driver: Driver, distanceKm: number): number {
  // Rating score: 4.0-5.0 → 40-50 points
  const ratingScore = (driver.rating / 5) * 50;

  // Distance score: 0km → 50 points, 5km → 0 points
  const maxDistance = 5;
  const distanceScore = Math.max(0, 50 - (distanceKm / maxDistance) * 50);

  return ratingScore + distanceScore;
}

/**
 * Get dispatch reason message
 */
function getReason(candidates: DispatchMatch[], serviceType: string, minRating: number): string {
  if (candidates.length === 0) {
    return `No drivers available for ${serviceType} service with rating ${minRating}+`;
  }

  if (candidates.length < 2) {
    return `Only 1 driver found matching criteria`;
  }

  return `Found ${candidates.length} available drivers`;
}

/**
 * Get default location for a driver (mock location)
 * In production, this would come from real-time location tracking
 */
function getDefaultDriverLocation(driver: Driver): DriverLocation {
  // Generate consistent mock location based on driver ID hash
  let hash = 0;
  for (let i = 0; i < driver.id.length; i++) {
    hash = driver.id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const seed = Math.abs(hash) % 10;
  const baseLat = -6.2 + seed * 0.01; // Jakarta area
  const baseLon = 106.8 + seed * 0.01;

  return {
    driverId: driver.id,
    latitude: baseLat,
    longitude: baseLon,
    updatedAt: new Date(),
  };
}

/**
 * Simulate sending dispatch offer to driver
 * In production, this would use WebSocket or push notifications
 */
export async function sendDispatchOffer(driverId: string, rideId: string): Promise<boolean> {
  // Simulate 80% acceptance rate
  const accepted = Math.random() > 0.2;

  // In production, this would:
  // 1. Send push notification to driver
  // 2. Wait for response
  // 3. Handle timeout (30 seconds)
  // 4. Track acceptance/rejection

  console.log(`[Dispatch] Offer sent to driver ${driverId} for ride ${rideId}`);

  return accepted;
}

/**
 * Validate dispatch request
 */
export function validateDispatchRequest(request: DispatchRequest): { valid: boolean; error?: string } {
  if (!request.pickupLocation || isNaN(request.pickupLocation.latitude) || isNaN(request.pickupLocation.longitude)) {
    return { valid: false, error: 'Pickup location is required' };
  }

  if (!request.serviceType) {
    return { valid: false, error: 'Service type is required' };
  }

  if (request.minRating !== undefined && (request.minRating < 0 || request.minRating > 5)) {
    return { valid: false, error: 'Minimum rating must be between 0 and 5' };
  }

  return { valid: true };
}
