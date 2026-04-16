/**
 * Ride Hailing Data Types
 * Core types for fare calculation and driver dispatch
 */

export type RideStatus = 'searching' | 'matched' | 'accepted' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
export type DispatchStatus = 'pending' | 'accepted' | 'rejected' | 'expired';

export interface Ride {
  id: string;
  userId: string;
  pickupLocation: Location;
  dropoffLocation: Location;
  serviceId: string;
  driverId?: string;
  fareId?: string;
  status: RideStatus;
  requestedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

export interface Fare {
  id: string;
  rideId: string;
  baseFare: number;
  distanceFare: number;
  surgeFare: number;
  discountAmount: number;
  total: number;
  breakdown: FareBreakdown;
  createdAt: Date;
}

export interface FareBreakdown {
  baseAmount: number;
  perKmRate: number;
  totalDistance: number;
  surgeMultiplier: number;
  discountPercentage: number;
}

export interface DriverLocation {
  driverId: string;
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  updatedAt: Date;
}

export interface Dispatch {
  id: string;
  rideId: string;
  driverId: string;
  offerStatus: DispatchStatus;
  offeredAt: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
  expiresAt: Date;
  reason?: string;
}

export interface DispatchMatch {
  driverId: string;
  distanceToPickup: number;
  estimatedArrival: number; // minutes
  rating: number;
  score: number; // matching score
}

export interface SurgeMultiplier {
  time: Date;
  multiplier: number;
  reason: string;
}
