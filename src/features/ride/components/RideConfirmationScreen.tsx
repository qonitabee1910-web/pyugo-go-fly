/**
 * RideConfirmationScreen Component
 * Confirm ride details, service type, and estimated fare
 */

import { Location, SERVICE_TYPE_LABELS, Route } from '@/lib/types/rides';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { MapPin, Clock, Banknote, ChevronRight, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { ComponentStyles, PATTERNS } from '@/design-system';

interface RideConfirmationScreenProps {
  pickupLocation: Location;
  dropoffLocation: Location;
  route: Route | null;
  estimatedFare: number | null;
  serviceType: 'motorcycle' | 'car' | 'auto';
  onServiceTypeChange: (type: 'motorcycle' | 'car' | 'auto') => void;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function RideConfirmationScreen({
  pickupLocation,
  dropoffLocation,
  route,
  estimatedFare,
  serviceType,
  onServiceTypeChange,
  onConfirm,
  onCancel,
  loading = false,
}: RideConfirmationScreenProps) {
  const formatDistance = (meters: number) => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${meters} m`;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes} menit`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}j ${mins}m`;
  };

  const serviceOptions = ['motorcycle', 'car', 'auto'] as const;

  return (
    <div className="fixed inset-0 bg-white z-40 flex flex-col">
      {/* Header */}
      <div className={`p-4 border-b border-gray-200 ${PATTERNS.stickyHeader}`}>
        <h2 className={ComponentStyles.typography.h3}>Konfirmasi Pesanan</h2>
        <p className={ComponentStyles.typography.bodySmall}>Periksa detail perjalanan Anda</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="p-4 space-y-6">
          {/* Route Summary Card */}
          <div className={ComponentStyles.card.base}>
            <h3 className={`${ComponentStyles.typography.h4} mb-4`}>Rute Perjalanan</h3>

            {/* Pickup */}
            <div className="flex gap-4 mb-4">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full bg-green-100 flex items-center justify-center`}>
                  <MapPin size={20} className="text-green-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className={ComponentStyles.typography.label}>Jemput</p>
                <p className={`${ComponentStyles.typography.body} truncate`}>{pickupLocation.address}</p>
              </div>
            </div>

            {/* Route Line */}
            <div className="ml-5 border-l-2 border-gradient-to-b from-green-400 to-red-400 h-8 mb-4" />

            {/* Dropoff */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full bg-red-100 flex items-center justify-center`}>
                  <MapPin size={20} className="text-red-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className={ComponentStyles.typography.label}>Tujuan</p>
                <p className={`${ComponentStyles.typography.body} truncate`}>{dropoffLocation.address}</p>
              </div>
            </div>
          </div>

          {/* Trip Info Grid */}
          {route && (
            <div className="grid grid-cols-2 gap-4">
              <div className={ComponentStyles.card.elevated}>
                <div className="p-4 text-center">
                  <div className="text-3xl mb-2">📏</div>
                  <p className={ComponentStyles.typography.caption}>Jarak</p>
                  <p className={`${ComponentStyles.typography.h3} text-blue-600 mt-1`}>
                    {formatDistance(route.distance_meters)}
                  </p>
                </div>
              </div>

              <div className={ComponentStyles.card.elevated}>
                <div className="p-4 text-center">
                  <div className="text-3xl mb-2">⏱️</div>
                  <p className={ComponentStyles.typography.caption}>Waktu</p>
                  <p className={`${ComponentStyles.typography.h3} text-blue-600 mt-1`}>
                    {formatDuration(route.duration_seconds)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Service Type Selection */}
          <div>
            <h3 className={`${ComponentStyles.typography.h4} mb-4`}>Pilih Jenis Kendaraan</h3>
            <div className="space-y-3">
              {serviceOptions.map((type) => (
                <button
                  key={type}
                  onClick={() => onServiceTypeChange(type)}
                  className={`w-full p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                    serviceType === type
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-left">
                    <p className={`${ComponentStyles.typography.body} font-semibold`}>
                      {SERVICE_TYPE_LABELS[type]}
                    </p>
                    <p className={ComponentStyles.typography.caption}>
                      {type === 'motorcycle' ? '🏍️ 1-2 orang' : type === 'car' ? '🚗 4-5 orang' : '🚐 6-8 orang'}
                    </p>
                  </div>
                  {serviceType === type && (
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Fare Breakdown */}
          {estimatedFare && (
            <div className={`${ComponentStyles.card.base} bg-gradient-to-br from-blue-50 to-indigo-50`}>
              <h3 className={`${ComponentStyles.typography.h4} mb-4`}>Estimasi Tarif</h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className={ComponentStyles.typography.body}>Tarif Dasar</span>
                  <span className={`${ComponentStyles.typography.body} font-semibold`}>Rp 10.000</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className={ComponentStyles.typography.body}>Jarak</span>
                  <span className={`${ComponentStyles.typography.body} font-semibold`}>
                    {route && `Rp ${Math.round((route.distance_meters / 1000) * 2500).toLocaleString('id-ID')}`}
                  </span>
                </div>

                <div className="border-t-2 border-blue-200 my-2" />

                <div className="flex justify-between items-center">
                  <span className={ComponentStyles.typography.h4}>Total</span>
                  <span className={`${ComponentStyles.typography.h3} text-blue-600 font-bold`}>
                    Rp {estimatedFare.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className={`${ComponentStyles.alert.base} ${ComponentStyles.alert.info}`}>
                <AlertCircle size={20} className="flex-shrink-0" />
                <p className={ComponentStyles.typography.caption}>
                  Tarif akhir dapat berubah berdasarkan lalu lintas dan rute sebenarnya
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer CTA */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 space-y-3 z-40`}>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`${ComponentStyles.button.base} ${ComponentStyles.button.primary} ${ComponentStyles.button.lg} w-full`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Mengonfirmasi...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              Pesan Sekarang • Rp {estimatedFare?.toLocaleString('id-ID') || '0'}
              <ChevronRight size={20} />
            </span>
          )}
        </button>

        <button
          onClick={onCancel}
          disabled={loading}
          className={`${ComponentStyles.button.base} ${ComponentStyles.button.outline} ${ComponentStyles.button.lg} w-full`}
        >
          Batal
        </button>
      </div>
    </div>
  );
}
