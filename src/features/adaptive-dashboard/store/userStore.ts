/**
 * User data types for adaptive dashboard
 * Use Context API or component state instead of Zustand
 */

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar_url?: string;
  rating?: number;
  total_trips?: number;
}

export interface RideData {
  id: string;
  driver_id: string;
  passenger_id: string;
  pickup_lat: number;
  pickup_lng: number;
  dropoff_lat: number;
  dropoff_lng: number;
  status: 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  estimated_duration?: number;
  actual_duration?: number;
  fare?: number;
}

export const mockUserProfile: UserProfile = {
  id: 'user-123',
  name: 'Ahmad Rizki',
  email: 'ahmad@example.com',
  phone: '081234567890',
  avatar_url: 'https://api.ui-avatars.com/api/?name=Ahmad+Rizki',
  rating: 4.8,
  total_trips: 24,
};

