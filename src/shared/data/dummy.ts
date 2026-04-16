export interface Shuttle {
  id: string;
  operator: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  seatsAvailable: number;
  totalSeats: number;
  facilities: string[];
  type: string;
}

export interface Booking {
  id: string;
  code: string;
  type: 'shuttle' | 'ride';
  status: 'menunggu' | 'dikonfirmasi' | 'selesai' | 'dibatalkan';
  date: string;
  totalPrice: number;
  details: string;
  guestName: string;
}

export const cities = [
  'Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Bali', 'Semarang',
  'Malang', 'Solo', 'Medan', 'Makassar',
];

export const shuttles: Shuttle[] = [
  { id: 's1', operator: 'Xtrans', origin: 'Jakarta', destination: 'Bandung', departureTime: '06:00', arrivalTime: '09:00', duration: '3 jam', price: 150000, seatsAvailable: 8, totalSeats: 12, facilities: ['AC', 'Reclining Seat', 'USB Charger'], type: 'Executive' },
  { id: 's2', operator: 'Xtrans', origin: 'Jakarta', destination: 'Bandung', departureTime: '08:00', arrivalTime: '11:00', duration: '3 jam', price: 150000, seatsAvailable: 4, totalSeats: 12, facilities: ['AC', 'Reclining Seat', 'USB Charger'], type: 'Executive' },
  { id: 's3', operator: 'Baraya Travel', origin: 'Jakarta', destination: 'Bandung', departureTime: '07:00', arrivalTime: '10:30', duration: '3.5 jam', price: 95000, seatsAvailable: 10, totalSeats: 15, facilities: ['AC'], type: 'Reguler' },
  { id: 's4', operator: 'Baraya Travel', origin: 'Jakarta', destination: 'Bandung', departureTime: '10:00', arrivalTime: '13:30', duration: '3.5 jam', price: 95000, seatsAvailable: 6, totalSeats: 15, facilities: ['AC'], type: 'Reguler' },
  { id: 's5', operator: 'DayTrans', origin: 'Jakarta', destination: 'Bandung', departureTime: '09:00', arrivalTime: '12:00', duration: '3 jam', price: 175000, seatsAvailable: 3, totalSeats: 10, facilities: ['AC', 'Reclining Seat', 'WiFi', 'Snack'], type: 'VIP' },
  { id: 's6', operator: 'Xtrans', origin: 'Bandung', destination: 'Jakarta', departureTime: '14:00', arrivalTime: '17:00', duration: '3 jam', price: 150000, seatsAvailable: 7, totalSeats: 12, facilities: ['AC', 'Reclining Seat', 'USB Charger'], type: 'Executive' },
  { id: 's7', operator: 'Cipaganti', origin: 'Bandung', destination: 'Jakarta', departureTime: '06:30', arrivalTime: '10:00', duration: '3.5 jam', price: 120000, seatsAvailable: 9, totalSeats: 14, facilities: ['AC', 'Reclining Seat'], type: 'Executive' },
  { id: 's8', operator: 'DayTrans', origin: 'Jakarta', destination: 'Semarang', departureTime: '20:00', arrivalTime: '04:00', duration: '8 jam', price: 280000, seatsAvailable: 5, totalSeats: 10, facilities: ['AC', 'Reclining Seat', 'WiFi', 'Selimut'], type: 'VIP' },
];

export const promos = [
  { id: 'p1', title: 'Diskon Ride 20%', subtitle: 'Untuk pengguna baru', color: 'from-primary to-blue-700' },
  { id: 'p2', title: 'Shuttle Gratis Bagasi', subtitle: 'Berlaku untuk semua rute', color: 'from-emerald-500 to-teal-600' },
  { id: 'p3', title: 'Cashback Rp25.000', subtitle: 'Minimal transaksi Rp200.000', color: 'from-orange-500 to-red-500' },
];

export const dummyBookings: Booking[] = [
  { id: 'b2', code: 'PYU-SHT-20260405', type: 'shuttle', status: 'selesai', date: '2026-04-05', totalPrice: 300000, details: 'Xtrans Jakarta → Bandung — 2 penumpang', guestName: 'Budi Santoso' },
  { id: 'b4', code: 'PYU-SHT-20260412', type: 'shuttle', status: 'dibatalkan', date: '2026-04-12', totalPrice: 175000, details: 'DayTrans Jakarta → Bandung — 1 penumpang', guestName: 'Budi Santoso' },
];

export interface RideService {
  id: string;
  name: string;
  type: 'motor' | 'women' | 'car';
  pricePerKm: number;
  icon: string;
  description: string;
  estimatedArrival: string;
}

export interface Driver {
  id: string;
  name: string;
  rating: number;
  vehicle: string;
  plateNumber: string;
  photo: string;
  phone: string;
}

export const rideServices: RideService[] = [
  { id: 'rs1', name: 'PYU Ride', type: 'motor', pricePerKm: 2500, icon: 'bike', description: 'Motor cepat & hemat', estimatedArrival: '3-5 menit' },
  { id: 'rs2', name: 'PYU Ladies', type: 'women', pricePerKm: 3000, icon: 'user-round', description: 'Pengemudi wanita untuk penumpang wanita', estimatedArrival: '5-8 menit' },
  { id: 'rs3', name: 'PYU Car', type: 'car', pricePerKm: 5000, icon: 'car', description: 'Mobil nyaman, AC, 4 penumpang', estimatedArrival: '5-10 menit' },
];

export const dummyDrivers: Driver[] = [
  { id: 'd1', name: 'Agus Pratama', rating: 4.9, vehicle: 'Honda Vario 160', plateNumber: 'B 1234 XYZ', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', phone: '081234567890' },
  { id: 'd2', name: 'Siti Nurhaliza', rating: 4.8, vehicle: 'Honda Beat', plateNumber: 'B 5678 ABC', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', phone: '081298765432' },
  { id: 'd3', name: 'Budi Setiawan', rating: 4.7, vehicle: 'Toyota Avanza', plateNumber: 'B 9012 DEF', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face', phone: '081345678901' },
  { id: 'd4', name: 'Dewi Lestari', rating: 4.9, vehicle: 'Honda Scoopy', plateNumber: 'B 3456 GHI', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', phone: '081456789012' },
  { id: 'd5', name: 'Rudi Hartono', rating: 4.6, vehicle: 'Toyota Innova', plateNumber: 'B 7890 JKL', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face', phone: '081567890123' },
];

export const formatRupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
