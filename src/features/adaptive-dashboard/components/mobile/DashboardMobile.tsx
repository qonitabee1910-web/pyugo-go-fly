import { useState, useEffect } from 'react';
import { Car, Bus, Hotel, HelpCircle, MapPin, Navigation, Home, ShoppingBag, Menu, Plane, Utensils, Train, UtensilsCrossed, Award } from 'lucide-react';
import { SharedHeader } from '../shared/Header';
import { PromoCarousel } from '../shared/PromoCarousel';
import { BookingCard } from '../shared/BookingCard';
import { MobileSkeletonDashboard } from '../shared/Skeleton';
import { mockBookings } from '../../store/bookingStore';
import { useAuth } from '@/features/auth/AuthContext';

interface ServiceIcon {
  id: string;
  emoji: string;
  label: string;
  route: string;
}

const SERVICES_GRID: ServiceIcon[] = [
  {
    id: 'flight',
    emoji: '✈️',
    label: 'Tiket Pesawat',
    route: '/flight',
  },
  {
    id: 'hotel',
    emoji: '🏨',
    label: 'Hotel',
    route: '/hotel',
  },
  {
    id: 'experience',
    emoji: '🎭',
    label: 'Xperience',
    route: '/experience',
  },
  {
    id: 'bus',
    emoji: '🚌',
    label: 'Bus & Travel',
    route: '/bus',
  },
  {
    id: 'train',
    emoji: '🚄',
    label: 'Tiket Kereta',
    route: '/train',
  },
  {
    id: 'tour',
    emoji: '🎒',
    label: 'Paket Wisata',
    route: '/tour',
  },
  {
    id: 'ride',
    emoji: '🚗',
    label: 'Taksi & Ride',
    route: '/ride',
  },
  {
    id: 'rental',
    emoji: '🚙',
    label: 'Rental Mobil',
    route: '/rental',
  },
  {
    id: 'food',
    emoji: '🍔',
    label: 'Makanan',
    route: '/food',
  },
  {
    id: 'insurance',
    emoji: '🛡️',
    label: 'Asuransi',
    route: '/insurance',
  },
];

const MOCK_BOOKINGS_DATA = mockBookings;

export const DashboardMobile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState(MOCK_BOOKINGS_DATA);
  const [scrollPos, setScrollPos] = useState(0);
  const userEmail = user?.email || '';
  const userName = user?.user_metadata?.full_name || userEmail?.split('@')[0] || 'Pengguna';

  // Calculate which "page" (group of 5 items) we're on
  const itemsPerPage = 5;
  const currentPage = Math.round(scrollPos / 100);
  const totalPages = Math.ceil(SERVICES_GRID.length / itemsPerPage);

  if (loading) {
    return <MobileSkeletonDashboard />;
  }

  return (
    <div className="pb-24 bg-white">
      <SharedHeader isMobile={true} />

      {/* Search Bar */}
      <div className="px-4 py-4 bg-gradient-to-b from-blue-50 to-white border-b">
        <div className="flex items-center gap-2 bg-white rounded-lg border px-3 py-2">
          <MapPin size={18} className="text-blue-600" />
          <input
            type="text"
            placeholder="Mau kemana?"
            className="flex-1 text-sm outline-none bg-transparent"
          />
        </div>
      </div>

      {/* Services Grid - Traveloka Style */}
      <div className="px-4 py-6">
        {/* Grid Container */}
        <div className="grid grid-cols-5 gap-3 mb-3">
          {SERVICES_GRID.map((service) => (
            <a
              key={service.id}
              href={service.route}
              className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 active:scale-95 transition-all cursor-pointer"
            >
              <div className="text-4xl">{service.emoji}</div>
              <span className="text-xs font-medium text-gray-900 text-center leading-tight">
                {service.label}
              </span>
            </a>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-1">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setScrollPos((idx * 100) / totalPages)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentPage ? 'bg-blue-600 w-6' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Promo Carousel */}
      <PromoCarousel isMobile={true} autoPlay={true} />

      {/* Recent Bookings Section */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-gray-900">Pesanan Terbaru</h3>
          <a href="/orders" className="text-blue-600 text-sm font-medium hover:underline">
            Lihat Semua →
          </a>
        </div>

        {bookings.length > 0 ? (
          <div className="space-y-3">
            {bookings.slice(0, 2).map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                isMobile={true}
                onClick={() => {
                  /* Handle booking detail */
                }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <ShoppingBag size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Belum ada pesanan</p>
            <p className="text-sm text-gray-500 mt-1">
              Mulai pesan layanan PYU-GO sekarang!
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-around z-30">
        <a href="/beranda" className="flex flex-col items-center gap-1 py-2 text-blue-600">
          <Home size={20} />
          <span className="text-xs font-medium">Beranda</span>
        </a>
        <a href="/saved" className="flex flex-col items-center gap-1 py-2 text-gray-600 hover:text-gray-900">
          <ShoppingBag size={20} />
          <span className="text-xs font-medium">Simpan</span>
        </a>
        <a href="/orders" className="flex flex-col items-center gap-1 py-2 text-gray-600 hover:text-gray-900">
          <MapPin size={20} />
          <span className="text-xs font-medium">Pesanan</span>
        </a>
        <a href="/account" className="flex flex-col items-center gap-1 py-2 text-gray-600 hover:text-gray-900">
          <Menu size={20} />
          <span className="text-xs font-medium">Akun</span>
        </a>
      </div>
    </div>
  );
};
