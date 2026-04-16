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
import { AlertCircle, MapPin } from 'lucide-react';
import { Alert, AlertDescription } from '@/shared/ui/alert';

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
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Finding Your Ride</h2>
        <p className="text-sm text-gray-500 mt-1">Searching for nearby drivers...</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Searching Animation */}
          <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex justify-center mb-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-blue-200" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-2xl">🔍</div>
              </div>
            </div>
            <p className="font-semibold text-gray-900">Searching...</p>
            <p className="text-sm text-gray-600 mt-2">{displayElapsed}s</p>
          </Card>

          {/* Info */}
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm text-blue-800">
              We're notifying drivers nearby. You'll see live requests here.
            </AlertDescription>
          </Alert>

          {/* Nearby Drivers List */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Drivers in Your Area ({nearbyDrivers.length})</h3>
            <ScrollArea className="h-64">
              <div className="space-y-2 pr-4">
                {nearbyDrivers.length > 0 ? (
                  nearbyDrivers.map((driver) => (
                    <DriverCard key={driver.user_id} driver={driver} />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No drivers nearby</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Estimated Fare */}
          {estimatedFare && (
            <Card className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <p className="text-xs text-gray-600">Your estimated fare</p>
              <p className="text-2xl font-bold text-green-600 mt-1">₹{estimatedFare.toLocaleString()}</p>
            </Card>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button onClick={onCancel} variant="outline" className="w-full" size="lg">
          Cancel Search
        </Button>
      </div>
    </div>
  );
}

interface DriverCardProps {
  driver: NearbyDriver;
}

function DriverCard({ driver }: DriverCardProps) {
  return (
    <Card className="p-3 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 flex-shrink-0">
          <AvatarImage src={driver.photo_url} alt={driver.name} />
          <AvatarFallback>{driver.name[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">{driver.name}</p>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>⭐ {driver.rating}</span>
            <span>📏 {Math.round(driver.distance_meters / 1000)}km</span>
            <span>✓ {Math.round(driver.acceptance_probability * 100)}%</span>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <p className="text-xs text-gray-500">{driver.vehicle_type}</p>
          <p className="text-xs font-medium text-blue-600">
            {Math.round((driver.distance_meters / 40) * 3.6 / 60)}min away
          </p>
        </div>
      </div>
    </Card>
  );
}
