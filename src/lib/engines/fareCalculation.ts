/**
 * Fare Calculation Engine
 * Calculates ride fares based on service type, distance, and demand
 */

import { Fare, FareBreakdown, Location } from '@/lib/types/ride';
import { calculateDistance, Coordinates } from '@/lib/utils/distance';
import { getSurgeMultiplier, getSurgeReason, isSurgeActive } from '@/lib/utils/surge';
import { rideServices } from '@/shared/data/dummy';

export interface FareCalculationInput {
  pickupLocation: Coordinates;
  dropoffLocation: Coordinates;
  serviceId: string;
  bookingTime?: Date;
  discountCode?: string;
  discountPercentage?: number;
}

export interface FareCalculationResult {
  baseFare: number;
  distanceFare: number;
  surgeFare: number;
  discountAmount: number;
  totalFare: number;
  breakdown: FareBreakdown;
  surgeMultiplier: number;
  surgeReason: string;
}

/**
 * Calculate fare for a ride request
 */
export function calculateRideFare(input: FareCalculationInput): FareCalculationResult {
  // 1. Calculate base fare
  const baseFare = getBaseFare(input.serviceId);

  // 2. Calculate distance and distance fare
  const distance = calculateDistance(input.pickupLocation, input.dropoffLocation);
  const perKmRate = getPerKmRate(input.serviceId);
  const distanceFare = distance * perKmRate;

  // 3. Apply surge pricing
  const bookingTime = input.bookingTime || new Date();
  const surgeMultiplier = getSurgeMultiplier(bookingTime);
  const surgeReason = getSurgeReason(surgeMultiplier);
  const surgeFare = (baseFare + distanceFare) * (surgeMultiplier - 1);

  // 4. Apply discount
  const subtotal = baseFare + distanceFare + surgeFare;
  const discountPercentage = input.discountPercentage || 0;
  const discountAmount = subtotal * (discountPercentage / 100);

  // 5. Calculate total
  const totalFare = Math.max(subtotal - discountAmount, baseFare); // Minimum = base fare

  // 6. Build breakdown
  const breakdown: FareBreakdown = {
    baseAmount: baseFare,
    perKmRate,
    totalDistance: distance,
    surgeMultiplier,
    discountPercentage,
  };

  return {
    baseFare,
    distanceFare,
    surgeFare,
    discountAmount,
    totalFare,
    breakdown,
    surgeMultiplier,
    surgeReason,
  };
}

/**
 * Create Fare record from calculation result
 */
export function createFareRecord(rideId: string, result: FareCalculationResult): Omit<Fare, 'id' | 'createdAt'> {
  return {
    rideId,
    baseFare: result.baseFare,
    distanceFare: result.distanceFare,
    surgeFare: result.surgeFare,
    discountAmount: result.discountAmount,
    total: result.totalFare,
    breakdown: result.breakdown,
  };
}

/**
 * Get base fare for service type
 * Motorcycle: Rp 4,000
 * Women: Rp 5,000
 * Car: Rp 8,000
 */
function getBaseFare(serviceId: string): number {
  const service = rideServices.find(s => s.id === serviceId);

  switch (service?.type) {
    case 'motor':
      return 4000;
    case 'women':
      return 5000;
    case 'car':
      return 8000;
    default:
      return 4000;
  }
}

/**
 * Get per-km rate for service type
 */
function getPerKmRate(serviceId: string): number {
  const service = rideServices.find(s => s.id === serviceId);
  return service?.pricePerKm || 2500;
}

/**
 * Format fare for display
 */
export function formatFareDisplay(fare: FareCalculationResult): string {
  const { totalFare, surgeMultiplier } = fare;
  const isSurge = isSurgeActive(surgeMultiplier);

  if (isSurge) {
    return `Rp ${totalFare.toLocaleString('id-ID')} (${surgeMultiplier.toFixed(1)}x surge)`;
  }

  return `Rp ${totalFare.toLocaleString('id-ID')}`;
}

/**
 * Validate fare calculation input
 */
export function validateFareInput(input: FareCalculationInput): { valid: boolean; error?: string } {
  if (!input.serviceId) {
    return { valid: false, error: 'Service ID is required' };
  }

  if (input.pickupLocation.latitude === input.dropoffLocation.latitude &&
      input.pickupLocation.longitude === input.dropoffLocation.longitude) {
    return { valid: false, error: 'Pickup and dropoff locations must be different' };
  }

  if (input.discountPercentage && (input.discountPercentage < 0 || input.discountPercentage > 100)) {
    return { valid: false, error: 'Discount percentage must be between 0 and 100' };
  }

  return { valid: true };
}
