/**
 * Booking data types for adaptive dashboard
 * Use component state or Context API instead of Zustand
 */

export interface Booking {
  id: string;
  type: 'ride' | 'shuttle' | 'hotel';
  title: string;
  date: string;
  time: string;
  price: number;
  status: 'completed' | 'ongoing' | 'cancelled';
  details?: string;
}

export const mockBookings: Booking[] = [
  {
    id: '1',
    type: 'ride',
    title: 'Perjalanan ke Kota',
    date: '2 jam yang lalu',
    time: '14:30',
    price: 45000,
    status: 'completed',
    details: 'Jl. Sudirman → Jl. Gatot Subroto',
  },
  {
    id: '2',
    type: 'shuttle',
    title: 'Shuttle Bandara',
    date: 'Kemarin',
    time: '10:15',
    price: 75000,
    status: 'completed',
    details: 'Terminal → Bandara Soetta',
  },
  {
    id: '3',
    type: 'ride',
    title: 'Perjalanan ke Kantor',
    date: '3 hari yang lalu',
    time: '08:45',
    price: 52000,
    status: 'completed',
    details: 'Rumah → Kantor Pusat',
  },
];
