/**
 * RideConfirmationScreen Component
 * Confirm ride details, service type, and estimated fare
 */

import { Location, SERVICE_TYPE_LABELS, Route } from '@/lib/types/rides';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { MapPinIcon, ClockIcon, Banknote, ChevronRight, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/shared/ui/alert';

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
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const serviceOptions = ['motorcycle', 'car', 'auto'] as const;

  return (
    <div className="fixed inset-0 bg-white z-40 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Confirm Your Ride</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Route Summary */}
          <Card className="p-4 space-y-3">
            <h3 className="font-semibold text-sm">Route Details</h3>

            {/* Pickup */}
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  📍
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Pickup</p>
                <p className="font-medium text-sm">{pickupLocation.address}</p>
              </div>
            </div>

            {/* Route Line */}
            <div className="ml-4 border-l-2 border-gray-300 h-8" />

            {/* Dropoff */}
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                  📌
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Dropoff</p>
                <p className="font-medium text-sm">{dropoffLocation.address}</p>
              </div>
            </div>
          </Card>

          {/* Trip Info */}
          {route && (
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3 text-center">
                <div className="text-2xl mb-1">📏</div>
                <p className="text-sm text-gray-600">Distance</p>
                <p className="font-semibold">{formatDistance(route.distance_meters)}</p>
              </Card>
              <Card className="p-3 text-center">
                <div className="text-2xl mb-1">⏱️</div>
                <p className="text-sm text-gray-600">Est. Time</p>
                <p className="font-semibold">{formatDuration(route.duration_seconds)}</p>
              </Card>
            </div>
          )}

          {/* Service Type Selection */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Select Vehicle Type</h3>
            <div className="space-y-2">
              {serviceOptions.map((type) => (
                <button
                  key={type}
                  onClick={() => onServiceTypeChange(type)}
                  className={`w-full p-3 rounded-lg border-2 transition-all flex items-center justify-between ${
                    serviceType === type
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium">{SERVICE_TYPE_LABELS[type]}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Fare Breakdown */}
          {estimatedFare && (
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <h3 className="font-semibold text-sm mb-3">Fare Estimate</h3>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base Fare</span>
                  <span>₹10,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Distance</span>
                  <span>
                    {route && `₹${Math.round((route.distance_meters / 1000) * 2500)}`}
                  </span>
                </div>
                <div className="border-t border-blue-200 my-2" />
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span className="text-blue-600">₹{estimatedFare.toLocaleString()}</span>
                </div>
              </div>
              <Alert className="bg-white border-blue-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Final fare may vary based on traffic and actual route taken
                </AlertDescription>
              </Alert>
            </Card>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-3">
        <Button
          onClick={onConfirm}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          size="lg"
        >
          {loading ? 'Confirming...' : `Request Ride • ₹${estimatedFare?.toLocaleString() || '0'}`}
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          className="w-full"
          size="lg"
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
