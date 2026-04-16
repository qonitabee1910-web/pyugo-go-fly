/**
 * Ride data types for adaptive dashboard
 * Use component state or Context API instead of Zustand
 */

export interface Driver {
  id: string;
  name: string;
  rating: number;
  vehicle: string;
  plate_number: string;
  avatar_url?: string;
  lat: number;
  lng: number;
}

export interface RideRequest {
  pickup_lat: number;
  pickup_lng: number;
  dropoff_lat: number;
  dropoff_lng: number;
  service_type: 'economy' | 'comfort' | 'premium';
  estimated_fare?: number;
  estimated_duration?: number;
}

export const mockDrivers: Driver[] = [
  {
    id: 'driver-1',
    name: 'Budi Santoso',
    rating: 4.9,
    vehicle: 'Toyota Avanza',
    plate_number: 'B 1234 XYZ',
    avatar_url: 'https://api.ui-avatars.com/api/?name=Budi+Santoso',
    lat: -6.2088,
    lng: 106.8456,
  },
  {
    id: 'driver-2',
    name: 'Reza Wijaya',
    rating: 4.8,
    vehicle: 'Honda Civic',
    plate_number: 'B 5678 ABC',
    avatar_url: 'https://api.ui-avatars.com/api/?name=Reza+Wijaya',
    lat: -6.2175,
    lng: 106.8356,
  },
];
