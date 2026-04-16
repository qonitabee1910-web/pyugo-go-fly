/**
 * Ride Feature Types & Constants
 * Type definitions for on-demand ride hailing
 */

export type RideStatus = 'idle' | 'searching' | 'accepted' | 'ongoing' | 'completed' | 'cancelled';

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
  placeId?: string;
}

export interface Route {
  distance_meters: number;
  duration_seconds: number;
  polyline?: string; // Encoded polyline for map display
  steps?: RouteStep[];
}

export interface RouteStep {
  instruction: string;
  distance_meters: number;
  duration_seconds: number;
}

export interface RideRequest {
  id: string;
  user_id: string;
  pickup_location: Location;
  dropoff_location: Location;
  route: Route;
  status: RideStatus;
  estimated_fare: number;
  service_type: 'motorcycle' | 'car' | 'auto'; // 'women' support later
  created_at: string;
  updated_at: string;
}

export interface Driver {
  id: string;
  user_id: string;
  name: string;
  rating: number;
  vehicle_type: string;
  vehicle_plate: string;
  vehicle_color: string;
  photo_url: string;
  current_location?: Location;
  distance_from_pickup_meters?: number;
  eta_minutes?: number;
}

export interface RideAssignment {
  ride_id: string;
  driver_id: string;
  driver: Driver;
  assigned_at: string;
  status: 'pending' | 'accepted' | 'arrived' | 'started' | 'completed';
}

export interface NearbyDriver {
  user_id: string;
  name: string;
  rating: number;
  vehicle_type: string;
  photo_url: string;
  current_lat: number;
  current_lng: number;
  distance_meters: number;
  acceptance_probability: number;
}

// Constants
export const RIDE_STATUS_LABELS: Record<RideStatus, string> = {
  idle: 'Ready to Book',
  searching: 'Finding Driver...',
  accepted: 'Driver Accepted',
  ongoing: 'Trip in Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const SERVICE_TYPE_LABELS = {
  motorcycle: '🏍️ Motorbike',
  car: '🚗 Car',
  auto: '🚕 Auto',
};

export const DUMMY_DRIVERS: NearbyDriver[] = [
  {
    user_id: 'driver_1',
    name: 'Ahmad',
    rating: 4.8,
    vehicle_type: 'motorcycle',
    photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad',
    current_lat: -6.2088,
    current_lng: 106.6753,
    distance_meters: 320,
    acceptance_probability: 0.92,
  },
  {
    user_id: 'driver_2',
    name: 'Budi',
    rating: 4.6,
    vehicle_type: 'car',
    photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
    current_lat: -6.2095,
    current_lng: 106.6745,
    distance_meters: 450,
    acceptance_probability: 0.85,
  },
  {
    user_id: 'driver_3',
    name: 'Citra',
    rating: 4.9,
    vehicle_type: 'car',
    photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Citra',
    current_lat: -6.2100,
    current_lng: 106.6760,
    distance_meters: 580,
    acceptance_probability: 0.88,
  },
];

// Demo locations in Jakarta
export const DEMO_LOCATIONS = {
  current: {
    latitude: -6.2088,
    longitude: 106.6753,
    address: 'Jl. Sudirman, Jakarta',
  },
  popular: [
    { latitude: -6.2088, longitude: 106.6753, address: 'Jl. Sudirman, Jakarta' },
    { latitude: -6.1751, longitude: 106.8249, address: 'Jakarta Convention Center' },
    { latitude: -6.2155, longitude: 106.8270, address: 'Bandara Soekarno-Hatta' },
    { latitude: -6.2383, longitude: 106.7880, address: 'Stasiun Kota' },
    { latitude: -6.1953, longitude: 106.7932, address: 'Monumen Nasional' },
  ],
};
