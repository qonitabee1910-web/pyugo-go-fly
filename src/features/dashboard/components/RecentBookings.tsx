/**
 * Recent Bookings Component
 * Displays user's recent orders and bookings
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RideService } from '@/integrations/ride.service';
import { Car, MapPin, Clock, ChevronRight } from 'lucide-react';

interface Booking {
  id: string;
  type: 'ride' | 'shuttle' | 'hotel' | 'help';
  title: string;
  location?: string;
  date: string;
  price: number;
  status: 'completed' | 'cancelled' | 'ongoing';
  icon: string;
}

export function RecentBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock recent bookings
    const mockBookings: Booking[] = [
      {
        id: 'ride-1',
        type: 'ride',
        title: 'Perjalanan ke Kota',
        location: 'Jl. Sudirman → Jl. Gatot Subroto',
        date: '2 jam yang lalu',
        price: 45000,
        status: 'completed',
        icon: '🚗',
      },
      {
        id: 'shuttle-1',
        type: 'shuttle',
        title: 'Shuttle Bandara',
        location: 'Terminal → Bandara Soekarno-Hatta',
        date: 'Kemarin',
        price: 75000,
        status: 'completed',
        icon: '🚌',
      },
      {
        id: 'ride-2',
        type: 'ride',
        title: 'Perjalanan ke Kantor',
        location: 'Rumah → Kantor',
        date: '3 hari yang lalu',
        price: 52000,
        status: 'completed',
        icon: '🚗',
      },
    ];

    setBookings(mockBookings);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Pesanan Terbaru</h3>
        <button
          onClick={() => navigate('/pesanan')}
          className="text-blue-600 text-sm font-medium hover:text-blue-700"
        >
          Lihat Semua →
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-gray-500 text-sm">Belum ada pesanan</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <button
              key={booking.id}
              onClick={() => navigate(`/pesanan`)}
              className="w-full bg-white rounded-lg p-4 hover:shadow-md transition-shadow active:scale-95 transform duration-150"
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-lg">
                  {booking.icon}
                </div>

                {/* Content */}
                <div className="flex-1 text-left min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm">{booking.title}</h4>
                  {booking.location && (
                    <p className="text-xs text-gray-500 mt-1 flex items-start gap-1">
                      <MapPin size={12} className="flex-shrink-0 mt-0.5" />
                      <span className="truncate">{booking.location}</span>
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Clock size={12} />
                    {booking.date}
                  </p>
                </div>

                {/* Price and Status */}
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-gray-900 text-sm">
                    Rp {booking.price.toLocaleString('id-ID')}
                  </p>
                  <span
                    className={`text-xs font-medium mt-1 inline-block px-2 py-1 rounded ${
                      booking.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {booking.status === 'completed' ? 'Selesai' : booking.status}
                  </span>
                </div>

                {/* Arrow */}
                <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
