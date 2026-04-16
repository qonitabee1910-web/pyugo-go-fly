/**
 * DriverSearchingScreen Component
 * Show searching state and nearby drivers that might accept the ride
 */

import { useEffect, useState } from 'react';
import { NearbyDriver } from '@/lib/types/rides';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/ui/avatar';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { AlertCircle, MapPin, Clock, Star } from 'lucide-react';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { ComponentStyles, PATTERNS, STATES } from '@/design-system';

interface DriverSearchingScreenProps {
  nearbyDrivers: NearbyDriver[];
  estimatedFare: number | null;
  onCancel: () => void;
  elapsedSeconds?: number;
}

export function DriverSearchingScreen({
  nearbyDrivers,
  estimatedFare,
  onCancel,
  elapsedSeconds = 0,
}: DriverSearchingScreenProps) {
  const [displayElapsed, setDisplayElapsed] = useState(elapsedSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-40 flex flex-col">
      {/* Header */}
      <div className={`p-4 border-b border-gray-200 ${PATTERNS.stickyHeader}`}>
        <h2 className={ComponentStyles.typography.h3}>Mencari Pengemudi</h2>
        <p className={ComponentStyles.typography.bodySmall}>Kami menginformasikan pengemudi di sekitar...</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="p-4 space-y-6">
          {/* Searching Animation */}
          <div className={`${ComponentStyles.card.base} ${ComponentStyles.gradient.primary} p-8 text-center`}>
            <div className="flex justify-center mb-6">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200 opacity-50" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 animate-spin" />
                <div className={`absolute inset-0 flex items-center justify-center text-3xl`}>🔍</div>
              </div>
            </div>
            <p className={ComponentStyles.typography.h4}>Sedang Mencari...</p>
            <p className={`${ComponentStyles.typography.h3} text-blue-600 font-bold mt-2`}>{displayElapsed}s</p>
          </div>

          {/* Info */}
          <div className={`${ComponentStyles.alert.base} ${ComponentStyles.alert.info}`}>
            <AlertCircle size={20} className="flex-shrink-0" />
            <p className={ComponentStyles.typography.body}>
              Kami menginformasikan pengemudi terdekat. Anda akan melihat permintaan langsung di sini.
            </p>
          </div>

          {/* Nearby Drivers List */}
          <div>
            <h3 className={`${ComponentStyles.typography.h4} mb-4`}>
              Pengemudi di Sekitar ({nearbyDrivers.length})
            </h3>
            <ScrollArea className="h-80">
              <div className="space-y-3 pr-4">
                {nearbyDrivers.length > 0 ? (
                  nearbyDrivers.map((driver) => (
                    <DriverCard key={driver.user_id} driver={driver} />
                  ))
                ) : (
                  <div className={STATES.empty.container}>
                    <MapPin className="w-12 h-12" />
                    <p className={STATES.empty.title}>Tidak Ada Pengemudi Terdekat</p>
                    <p className={STATES.empty.description}>Tunggu sebentar, kami mencari...</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Estimated Fare */}
          {estimatedFare && (
            <div className={`${ComponentStyles.card.base} bg-gradient-to-r from-green-50 to-emerald-50`}>
              <p className={ComponentStyles.typography.caption}>Estimasi Tarif Anda</p>
              <p className={`${ComponentStyles.typography.h2} text-green-600 font-bold mt-2`}>
                Rp {estimatedFare.toLocaleString('id-ID')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40`}>
        <button
          onClick={onCancel}
          className={`${ComponentStyles.button.base} ${ComponentStyles.button.outline} ${ComponentStyles.button.lg} w-full`}
        >
          Batal Pencarian
        </button>
      </div>
    </div>
  );
}

interface DriverCardProps {
  driver: NearbyDriver;
}

function DriverCard({ driver }: DriverCardProps) {
  return (
    <div className={ComponentStyles.card.elevated}>
      <div className="p-4 flex items-center gap-4">
        <Avatar className="h-14 w-14 flex-shrink-0 border-2 border-blue-200">
          <AvatarImage src={driver.photo_url} alt={driver.name} />
          <AvatarFallback className="bg-blue-100 text-blue-600 font-bold">
            {driver.name[0]}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <p className={ComponentStyles.typography.body}>{driver.name}</p>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
              <span className={ComponentStyles.typography.caption}>{driver.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={16} className="text-gray-400" />
              <span className={ComponentStyles.typography.caption}>
                {Math.round(driver.distance_meters / 1000)} km
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} className="text-gray-400" />
              <span className={ComponentStyles.typography.caption}>
                {Math.round((driver.distance_meters / 40) * 3.6 / 60)} min
              </span>
            </div>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <p className={ComponentStyles.typography.caption}>{driver.vehicle_type}</p>
          <p className={`${ComponentStyles.typography.body} text-green-600 font-semibold mt-1`}>
            {Math.round(driver.acceptance_probability * 100)}%
          </p>
        </div>
      </div>
    </div>
  );
}
