/**
 * TripOngoingScreen Component
 * Display active trip with driver location, eta, and trip controls
 */

import { Driver, Location } from '@/lib/types/rides';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { AlertCircle, MapPin, Phone, MessageSquare, Share2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/shared/ui/alert';

interface TripOngoingScreenProps {
  driver: Driver;
  pickupLocation: Location;
  dropoffLocation: Location;
  status: 'arrived' | 'started' | 'completing';
  eta?: number; // in minutes
  currentDistance?: number; // in meters
  onCall?: () => void;
  onMessage?: () => void;
  onShare?: () => void;
}

export function TripOngoingScreen({
  driver,
  pickupLocation,
  dropoffLocation,
  status,
  eta,
  currentDistance,
  onCall,
  onMessage,
  onShare,
}: TripOngoingScreenProps) {
  const statusLabels = {
    arrived: 'Driver Arrived',
    started: 'Trip in Progress',
    completing: 'Almost There',
  };

  const statusColors = {
    arrived: 'bg-yellow-100 text-yellow-800',
    started: 'bg-blue-100 text-blue-800',
    completing: 'bg-green-100 text-green-800',
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-blue-50 to-white rounded-lg overflow-hidden flex flex-col">
      {/* Header with Driver Info */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <Badge className={`${statusColors[status]} text-xs font-semibold px-3 py-1`}>
            {statusLabels[status]}
          </Badge>
          {eta && <span className="text-sm font-semibold">ETA: {eta} min</span>}
        </div>

        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 border-2 border-white">
            <AvatarImage src={driver.photo_url} alt={driver.name} />
            <AvatarFallback>{driver.name[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h3 className="font-bold text-lg">{driver.name}</h3>
            <p className="text-blue-100 text-sm">{driver.vehicle_type} • {driver.vehicle_plate}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-yellow-300">⭐ {driver.rating}</span>
              {currentDistance && (
                <span className="text-blue-100 text-xs">• {Math.round(currentDistance / 1000)}km away</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trip Progress */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Pickup & Dropoff */}
          <Card className="p-4 border-2 border-blue-100">
            {/* Pickup */}
            <div className="flex gap-3 mb-4 pb-4 border-b-2 border-gray-200">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-lg">
                  📍
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-medium">PICKUP</p>
                <p className="font-semibold text-sm mt-1">{pickupLocation.address}</p>
                {status === 'arrived' && (
                  <p className="text-xs text-green-600 mt-1">✓ Driver arrived</p>
                )}
              </div>
            </div>

            {/* Dropoff */}
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-lg">
                  📌
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 font-medium">DROPOFF</p>
                <p className="font-semibold text-sm mt-1">{dropoffLocation.address}</p>
                {status === 'completing' && (
                  <p className="text-xs text-blue-600 mt-1">↻ Arriving soon</p>
                )}
              </div>
            </div>
          </Card>

          {/* Vehicle Info */}
          <Card className="p-4 bg-gray-50">
            <h4 className="font-semibold text-sm mb-3">Vehicle Details</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-600">Type</p>
                <p className="font-medium capitalize">{driver.vehicle_type}</p>
              </div>
              <div>
                <p className="text-gray-600">Plate</p>
                <p className="font-medium">{driver.vehicle_plate}</p>
              </div>
              <div>
                <p className="text-gray-600">Color</p>
                <p className="font-medium capitalize">{driver.vehicle_color}</p>
              </div>
              <div>
                <p className="text-gray-600">Rating</p>
                <p className="font-medium">⭐ {driver.rating}</p>
              </div>
            </div>
          </Card>

          {/* Safety Alert */}
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-xs text-blue-800">
              Share your trip details with trusted contacts for safety
            </AlertDescription>
          </Alert>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-200 space-y-3 bg-white">
        <div className="grid grid-cols-3 gap-2">
          {onCall && (
            <Button
              onClick={onCall}
              variant="outline"
              className="flex items-center justify-center gap-2"
              size="sm"
            >
              <Phone className="w-4 h-4" />
              Call
            </Button>
          )}
          {onMessage && (
            <Button
              onClick={onMessage}
              variant="outline"
              className="flex items-center justify-center gap-2"
              size="sm"
            >
              <MessageSquare className="w-4 h-4" />
              Message
            </Button>
          )}
          {onShare && (
            <Button
              onClick={onShare}
              variant="outline"
              className="flex items-center justify-center gap-2"
              size="sm"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
