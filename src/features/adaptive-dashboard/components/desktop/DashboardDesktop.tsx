import { useState, useEffect } from 'react';
import { MapPin, Clock, ArrowRight, Zap, Star, TrendingUp } from 'lucide-react';
import { SharedHeader } from '../shared/Header';
import { PromoCarousel } from '../shared/PromoCarousel';
import { BookingCard } from '../shared/BookingCard';
import { DesktopSkeletonDashboard } from '../shared/Skeleton';
import { mockBookings } from '../../store/bookingStore';
import { mockCurrentLocation, type Location } from '../../store/locationStore';
import { calculateFare, formatCurrency } from '../../utils/calculations';
import { useAuth } from '@/features/auth/AuthContext';

interface ServiceTile {
  id: string;
  icon: string;
  name: string;
  description: string;
  color: string;
  route: string;
}

const SERVICES: ServiceTile[] = [
  {
    id: 'ride',
    icon: '🚗',
    name: 'Naik (Ride)',
    description: 'Pesan kendaraan pribadi',
    color: 'from-blue-500 to-blue-600',
    route: '/ride/book',
  },
  {
    id: 'shuttle',
    icon: '🚌',
    name: 'Shuttle',
    description: 'Bus & shuttle bersama',
    color: 'from-purple-500 to-purple-600',
    route: '/shuttle',
  },
  {
    id: 'hotel',
    icon: '🏨',
    name: 'Hotel',
    description: 'Cari penginapan terbaik',
    color: 'from-amber-500 to-amber-600',
    route: '/hotel',
  },
  {
    id: 'food',
    icon: '🍔',
    name: 'Makanan',
    description: 'Pesan makanan online',
    color: 'from-red-500 to-red-600',
    route: '/food',
  },
];

const MOCK_BOOKINGS_DATA = mockBookings;

export const DashboardDesktop = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'ride' | 'shuttle' | 'hotel' | 'flight' | 'train' | 'rental'>('ride');
  const [serviceType, setServiceType] = useState<'economy' | 'comfort' | 'premium'>('economy');
  const [passengers, setPassengers] = useState(1);
  const [bookings, setBookings] = useState(MOCK_BOOKINGS_DATA);
  const [pickup, setPickup] = useState<Location>(mockCurrentLocation);
  const [dropoff, setDropoff] = useState<Location | null>(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setBookings(MOCK_BOOKINGS_DATA);
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return <DesktopSkeletonDashboard />;
  }

  const estimatedFare = calculateFare(12.5, serviceType); // 12.5 km example

  return (
    <div className="min-h-screen bg-gray-50">
      <SharedHeader isMobile={false} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6">
        {/* Booking Widget */}
        <div className="py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
            <div className="grid grid-cols-12 gap-6">
              {/* Tabs */}
              <div className="col-span-12 mb-6">
                <div className="flex border-b overflow-x-auto">
                  {[
                    { id: 'ride', icon: '🚗', label: 'Naik (Ride)', active: activeTab === 'ride' },
                    { id: 'shuttle', icon: '🚌', label: 'Shuttle', active: activeTab === 'shuttle' },
                    { id: 'flight', icon: '✈️', label: 'Pesawat', active: activeTab === 'flight' },
                    { id: 'hotel', icon: '🏨', label: 'Hotel', active: activeTab === 'hotel' },
                    { id: 'train', icon: '🚄', label: 'Kereta', active: activeTab === 'train' },
                    { id: 'rental', icon: '🚙', label: 'Rental', active: activeTab === 'rental' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-6 py-3 font-medium whitespace-nowrap flex items-center gap-2 transition ${
                        tab.active
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Inputs - Dynamic based on tab */}
              {(activeTab === 'ride' || activeTab === 'shuttle') && (
                <>
                  <div className="col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Penjemputan
                    </label>
                    <div className="flex items-center gap-3 border rounded-lg p-3 bg-gray-50 hover:bg-white transition">
                      <MapPin size={20} className="text-blue-600 flex-shrink-0" />
                      <input
                        type="text"
                        placeholder="Dari mana?"
                        value={pickup?.address || ''}
                        onChange={(e) => setPickup({ ...pickup, address: e.target.value })}
                        className="w-full bg-transparent text-sm font-medium outline-none"
                      />
                    </div>
                  </div>

                  <div className="col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tujuan
                    </label>
                    <div className="flex items-center gap-3 border rounded-lg p-3 bg-gray-50 hover:bg-white transition">
                      <MapPin size={20} className="text-green-600 flex-shrink-0" />
                      <input
                        type="text"
                        placeholder="Kemana?"
                        value={dropoff?.address || ''}
                        onChange={(e) => setDropoff({ lat: 0, lng: 0, ...dropoff, address: e.target.value })}
                        className="w-full bg-transparent text-sm font-medium outline-none"
                      />
                    </div>
                  </div>

                  <div className="col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal & Jam
                    </label>
                    <div className="flex items-center gap-3 border rounded-lg p-3 bg-gray-50 hover:bg-white transition">
                      <Clock size={20} className="text-amber-600 flex-shrink-0" />
                      <input
                        type="datetime-local"
                        className="flex-1 bg-transparent text-sm font-medium outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'flight' && (
                <>
                  <div className="col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bandara Keberangkatan
                    </label>
                    <div className="flex items-center gap-3 border rounded-lg p-3 bg-gray-50 hover:bg-white transition">
                      <MapPin size={20} className="text-blue-600 flex-shrink-0" />
                      <input
                        type="text"
                        placeholder="Dari mana?"
                        className="w-full bg-transparent text-sm font-medium outline-none"
                      />
                    </div>
                  </div>

                  <div className="col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bandara Tujuan
                    </label>
                    <div className="flex items-center gap-3 border rounded-lg p-3 bg-gray-50 hover:bg-white transition">
                      <MapPin size={20} className="text-green-600 flex-shrink-0" />
                      <input
                        type="text"
                        placeholder="Kemana?"
                        className="w-full bg-transparent text-sm font-medium outline-none"
                      />
                    </div>
                  </div>

                  <div className="col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Keberangkatan
                    </label>
                    <div className="flex items-center gap-3 border rounded-lg p-3 bg-gray-50 hover:bg-white transition">
                      <Clock size={20} className="text-amber-600 flex-shrink-0" />
                      <input
                        type="date"
                        className="flex-1 bg-transparent text-sm font-medium outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'hotel' && (
                <>
                  <div className="col-span-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Destinasi
                    </label>
                    <div className="flex items-center gap-3 border rounded-lg p-3 bg-gray-50 hover:bg-white transition">
                      <MapPin size={20} className="text-blue-600 flex-shrink-0" />
                      <input
                        type="text"
                        placeholder="Kota atau nama hotel?"
                        className="w-full bg-transparent text-sm font-medium outline-none"
                      />
                    </div>
                  </div>

                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-in
                    </label>
                    <input
                      type="date"
                      className="w-full border rounded-lg p-3 text-sm font-medium"
                    />
                  </div>

                  <div className="col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-out
                    </label>
                    <input
                      type="date"
                      className="w-full border rounded-lg p-3 text-sm font-medium"
                    />
                  </div>
                </>
              )}

              {/* Service Type Selection - Only for ride/shuttle */}
              {(activeTab === 'ride' || activeTab === 'shuttle') && (
                <div className="col-span-12">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tipe Layanan
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { type: 'economy', name: 'Ekonomi', price: '7k', time: '2 menit' },
                      { type: 'comfort', name: 'Kenyamanan', price: '10k', time: '3 menit' },
                      { type: 'premium', name: 'Premium', price: '15k', time: '5 menit' },
                    ].map((option) => (
                      <button
                        key={option.type}
                        onClick={() => setServiceType(option.type as any)}
                        className={`p-4 rounded-lg border-2 transition text-left ${
                          serviceType === option.type
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="font-semibold text-gray-900">{option.name}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {option.price} • Tiba dalam {option.time}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Passengers - Only for ride/shuttle */}
              {(activeTab === 'ride' || activeTab === 'shuttle') && (
                <div className="col-span-12 flex items-end justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jumlah Penumpang
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setPassengers(Math.max(1, passengers - 1))}
                        className="w-10 h-10 rounded-lg border hover:bg-gray-100 transition"
                      >
                        −
                      </button>
                      <span className="text-lg font-semibold text-gray-900 w-8 text-center">
                        {passengers}
                      </span>
                      <button
                        onClick={() => setPassengers(passengers + 1)}
                        className="w-10 h-10 rounded-lg border hover:bg-gray-100 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Estimasi Tarif</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(estimatedFare)}
                    </p>
                  </div>

                  <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2">
                    Cari Pengemudi
                    <ArrowRight size={20} />
                  </button>
                </div>
              )}

              {/* Search Button - For other tabs */}
              {!['ride', 'shuttle'].includes(activeTab) && (
                <div className="col-span-12">
                  <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2">
                    Cari {activeTab === 'flight' ? 'Penerbangan' : activeTab === 'hotel' ? 'Hotel' : activeTab === 'train' ? 'Kereta' : 'Kendaraan'}
                    <ArrowRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Promo Banner */}
      <PromoCarousel isMobile={false} autoPlay={true} />

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Layanan Kami</h2>
        <div className="grid grid-cols-4 gap-6">
          {SERVICES.map((service) => (
            <a
              key={service.id}
              href={service.route}
              className={`bg-gradient-to-br ${service.color} rounded-lg overflow-hidden text-white hover:shadow-lg transition-shadow cursor-pointer group`}
            >
              <div className="p-6 h-40 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <span className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                  {service.icon}
                </span>
                <h3 className="font-bold text-lg">{service.name}</h3>
                <p className="text-sm text-white/80 mt-1">{service.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white border-t border-b py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Ringkasan Aktivitas Anda</h2>
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Perjalanan</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    24
                  </p>
                </div>
                <Zap size={24} className="text-blue-600 opacity-20" />
              </div>
              <p className="text-xs text-gray-600">Tahun ini</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Rating Anda</p>
                  <div className="flex items-center gap-1 mt-2">
                    <p className="text-3xl font-bold text-green-600">
                      4.8
                    </p>
                    <Star size={20} className="text-green-600 fill-green-600" />
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-600">Dari 5 bintang</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Penghematan</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">
                    {formatCurrency(325000)}
                  </p>
                </div>
                <TrendingUp size={24} className="text-purple-600 opacity-20" />
              </div>
              <p className="text-xs text-gray-600">Dari diskon & reward</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Poin Reward</p>
                  <p className="text-3xl font-bold text-amber-600 mt-2">2,450</p>
                </div>
                <span className="text-3xl">🎁</span>
              </div>
              <p className="text-xs text-gray-600">Siap ditukar</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Riwayat Pesanan Terakhir</h2>
          <a href="/bookings" className="text-blue-600 font-medium hover:underline flex items-center gap-2">
            Lihat Semua
            <ArrowRight size={16} />
          </a>
        </div>

        {bookings.length > 0 ? (
          <div className="grid grid-cols-2 gap-6">
            {bookings.slice(0, 4).map((booking) => (
              <BookingCard key={booking.id} booking={booking} isMobile={false} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <p className="text-gray-600 font-medium">Belum ada pesanan</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t bg-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-600">
          <p>© 2026 PYU-GO. Semua hak dilindungi.</p>
        </div>
      </div>
    </div>
  );
};
