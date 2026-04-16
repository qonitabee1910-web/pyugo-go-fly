export interface Hotel {
  id: string;
  name: string;
  city: string;
  address: string;
  rating: number;
  stars: number;
  pricePerNight: number;
  image: string;
  facilities: string[];
  type: string;
  description: string;
  rooms: RoomType[];
  images: string[];
}

export interface RoomType {
  id: string;
  name: string;
  price: number;
  capacity: number;
  facilities: string[];
}

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
  type: 'hotel' | 'shuttle';
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

export const popularDestinations = [
  { city: 'Bali', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop', hotels: 1250 },
  { city: 'Yogyakarta', image: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=400&h=300&fit=crop', hotels: 830 },
  { city: 'Bandung', image: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=400&h=300&fit=crop', hotels: 720 },
  { city: 'Jakarta', image: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=400&h=300&fit=crop', hotels: 2100 },
  { city: 'Malang', image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=400&h=300&fit=crop', hotels: 450 },
  { city: 'Surabaya', image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=400&h=300&fit=crop', hotels: 680 },
];

export const hotels: Hotel[] = [
  {
    id: 'h1', name: 'Grand Hyatt Jakarta', city: 'Jakarta', address: 'Jl. MH Thamrin No.30',
    rating: 4.8, stars: 5, pricePerNight: 1850000,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop',
    facilities: ['WiFi', 'Kolam Renang', 'Spa', 'Restoran', 'Gym', 'Parkir'],
    type: 'Hotel Bintang 5', description: 'Hotel mewah di jantung kota Jakarta dengan pemandangan kota yang menakjubkan.',
    rooms: [
      { id: 'r1', name: 'Deluxe Room', price: 1850000, capacity: 2, facilities: ['AC', 'TV', 'WiFi', 'Minibar'] },
      { id: 'r2', name: 'Executive Suite', price: 3200000, capacity: 2, facilities: ['AC', 'TV', 'WiFi', 'Minibar', 'Bathtub', 'Living Room'] },
      { id: 'r3', name: 'Presidential Suite', price: 8500000, capacity: 4, facilities: ['AC', 'TV', 'WiFi', 'Minibar', 'Bathtub', 'Living Room', 'Kitchen'] },
    ],
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&fit=crop',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&fit=crop',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&fit=crop',
    ],
  },
  {
    id: 'h2', name: 'The Trans Luxury Hotel', city: 'Bandung', address: 'Jl. Gatot Subroto No.289',
    rating: 4.7, stars: 5, pricePerNight: 1200000,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop',
    facilities: ['WiFi', 'Kolam Renang', 'Spa', 'Restoran', 'Gym'],
    type: 'Hotel Bintang 5', description: 'Hotel bergaya Eropa klasik dengan fasilitas kelas dunia di Bandung.',
    rooms: [
      { id: 'r4', name: 'Superior Room', price: 1200000, capacity: 2, facilities: ['AC', 'TV', 'WiFi'] },
      { id: 'r5', name: 'Deluxe Room', price: 1800000, capacity: 2, facilities: ['AC', 'TV', 'WiFi', 'Minibar'] },
    ],
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&fit=crop',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&fit=crop',
    ],
  },
  {
    id: 'h3', name: 'Hotel Tentrem Yogyakarta', city: 'Yogyakarta', address: 'Jl. AM Sangaji No.72A',
    rating: 4.9, stars: 5, pricePerNight: 2100000,
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&h=400&fit=crop',
    facilities: ['WiFi', 'Kolam Renang', 'Spa', 'Restoran', 'Gym', 'Parkir', 'Laundry'],
    type: 'Hotel Bintang 5', description: 'Hotel mewah bergaya Jawa modern dengan keramahan khas Yogyakarta.',
    rooms: [
      { id: 'r6', name: 'Premiere Room', price: 2100000, capacity: 2, facilities: ['AC', 'TV', 'WiFi', 'Minibar', 'Bathtub'] },
      { id: 'r7', name: 'Tentrem Suite', price: 4500000, capacity: 3, facilities: ['AC', 'TV', 'WiFi', 'Minibar', 'Bathtub', 'Living Room'] },
    ],
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&fit=crop',
    ],
  },
  {
    id: 'h4', name: 'AYANA Resort Bali', city: 'Bali', address: 'Jl. Karang Mas Sejahtera, Jimbaran',
    rating: 4.8, stars: 5, pricePerNight: 2800000,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop',
    facilities: ['WiFi', 'Kolam Renang', 'Spa', 'Restoran', 'Pantai Privat', 'Gym'],
    type: 'Resort Bintang 5', description: 'Resort tepi tebing dengan pemandangan Samudra Hindia yang memukau.',
    rooms: [
      { id: 'r8', name: 'Resort View', price: 2800000, capacity: 2, facilities: ['AC', 'TV', 'WiFi', 'Minibar', 'Balkon'] },
      { id: 'r9', name: 'Ocean Suite', price: 5200000, capacity: 2, facilities: ['AC', 'TV', 'WiFi', 'Minibar', 'Balkon', 'Private Pool'] },
    ],
    images: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&fit=crop',
    ],
  },
  {
    id: 'h5', name: 'Ibis Budget Surabaya', city: 'Surabaya', address: 'Jl. HR Muhammad No.50',
    rating: 3.8, stars: 2, pricePerNight: 350000,
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&h=400&fit=crop',
    facilities: ['WiFi', 'Restoran', 'Parkir'],
    type: 'Hotel Budget', description: 'Hotel budget bersih dan nyaman di pusat bisnis Surabaya.',
    rooms: [
      { id: 'r10', name: 'Standard Room', price: 350000, capacity: 2, facilities: ['AC', 'TV', 'WiFi'] },
    ],
    images: [
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&fit=crop',
    ],
  },
  {
    id: 'h6', name: 'Fave Hotel Malang', city: 'Malang', address: 'Jl. Soekarno Hatta No.2',
    rating: 4.0, stars: 3, pricePerNight: 450000,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop',
    facilities: ['WiFi', 'Restoran', 'Parkir', 'Kolam Renang'],
    type: 'Hotel Bintang 3', description: 'Hotel modern dengan akses mudah ke tempat wisata di Malang.',
    rooms: [
      { id: 'r11', name: 'Standard Room', price: 450000, capacity: 2, facilities: ['AC', 'TV', 'WiFi'] },
      { id: 'r12', name: 'Superior Room', price: 650000, capacity: 2, facilities: ['AC', 'TV', 'WiFi', 'Minibar'] },
    ],
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&fit=crop',
    ],
  },
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
  { id: 'p1', title: 'Diskon Hotel 25%', subtitle: 'Untuk pemesanan pertama kali', color: 'from-primary to-blue-700' },
  { id: 'p2', title: 'Shuttle Gratis Bagasi', subtitle: 'Berlaku untuk semua rute', color: 'from-emerald-500 to-teal-600' },
  { id: 'p3', title: 'Cashback Rp50.000', subtitle: 'Minimal transaksi Rp500.000', color: 'from-orange-500 to-red-500' },
];

export const dummyBookings: Booking[] = [
  { id: 'b1', code: 'PYU-HTL-20260401', type: 'hotel', status: 'dikonfirmasi', date: '2026-04-01', totalPrice: 3700000, details: 'Grand Hyatt Jakarta — 2 malam, Deluxe Room', guestName: 'Budi Santoso' },
  { id: 'b2', code: 'PYU-SHT-20260405', type: 'shuttle', status: 'selesai', date: '2026-04-05', totalPrice: 300000, details: 'Xtrans Jakarta → Bandung — 2 penumpang', guestName: 'Budi Santoso' },
  { id: 'b3', code: 'PYU-HTL-20260410', type: 'hotel', status: 'menunggu', date: '2026-04-10', totalPrice: 2100000, details: 'Hotel Tentrem Yogyakarta — 1 malam, Premiere Room', guestName: 'Budi Santoso' },
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
