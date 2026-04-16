/**
 * TripCompletedScreen Component
 * Display trip summary, final fare, and allow rating
 */

import { useState } from 'react';
import { Driver, Location } from '@/lib/types/rides';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { MapPin, Star, MessageSquare } from 'lucide-react';
import { Textarea } from '@/shared/ui/textarea';

interface TripCompletedScreenProps {
  driver: Driver;
  pickupLocation: Location;
  dropoffLocation: Location;
  distance: number; // in meters
  duration: number; // in seconds
  estimatedFare: number;
  actualFare?: number;
  onRate?: (rating: number, comment: string) => void;
  onNewRide?: () => void;
}

export function TripCompletedScreen({
  driver,
  pickupLocation,
  dropoffLocation,
  distance,
  duration,
  estimatedFare,
  actualFare,
  onRate,
  onNewRide,
}: TripCompletedScreenProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitRating = () => {
    if (onRate) {
      onRate(rating, comment);
      setSubmitted(true);
    }
  };

  const finalFare = actualFare || estimatedFare;
  const formatDuration = (seconds: number) => {
    const minutes = Math.round(seconds / 60);
    return `${minutes} min`;
  };

  if (submitted) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-green-50 to-white rounded-lg overflow-hidden flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4 py-8">
          <div className="text-6xl">✅</div>
          <h2 className="text-2xl font-bold text-gray-900">Thank You!</h2>
          <p className="text-gray-600">Your rating has been submitted</p>

          <div className="pt-4">
            <div className="inline-flex items-center gap-1 px-4 py-2 bg-yellow-100 rounded-full">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-auto w-full space-y-3">
          <Button onClick={onNewRide} className="w-full" size="lg">
            Request Another Ride
          </Button>
          <Button variant="outline" className="w-full" size="lg">
            View Receipt
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-b from-blue-50 to-white rounded-lg overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4">
        <Badge className="bg-white/20 text-white mb-3">Trip Completed</Badge>
        <h2 className="text-2xl font-bold">Trip Summary</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Driver Card */}
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={driver.photo_url} alt={driver.name} />
                <AvatarFallback>{driver.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">{driver.name}</p>
                <p className="text-sm text-gray-600">{driver.vehicle_type}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">⭐ {driver.rating}</p>
              </div>
            </div>
          </Card>

          {/* Trip Details */}
          <Card className="p-4 space-y-3">
            <h3 className="font-semibold text-sm">Trip Details</h3>

            <div className="flex gap-3 pb-3 border-b border-gray-200">
              <div className="flex-shrink-0 text-lg">📍</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">From</p>
                <p className="font-medium text-sm truncate">{pickupLocation.address}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 text-lg">📌</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500">To</p>
                <p className="font-medium text-sm truncate">{dropoffLocation.address}</p>
              </div>
            </div>
          </Card>

          {/* Fare Breakdown */}
          <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <h3 className="font-semibold text-sm mb-3">Fare Details</h3>

            <div className="space-y-2 mb-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Distance</span>
                <span className="font-medium">{(distance / 1000).toFixed(1)} km</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">{formatDuration(duration)}</span>
              </div>
              {actualFare !== estimatedFare && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Estimated</span>
                  <span className="font-medium line-through text-gray-500">₹{estimatedFare.toLocaleString()}</span>
                </div>
              )}
              <div className="border-t border-green-200 my-2" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-green-600">₹{finalFare.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          {/* Rating Section */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Rate Your Ride</h3>

            {/* Stars */}
            <div className="flex justify-center gap-2 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setRating(i + 1)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Comment */}
            {rating > 0 && (
              <Textarea
                placeholder="Share your feedback (optional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="text-sm"
                rows={3}
              />
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-3 bg-white">
        {rating > 0 ? (
          <>
            <Button onClick={handleSubmitRating} className="w-full bg-green-500 hover:bg-green-600" size="lg">
              Submit Rating
            </Button>
            <Button onClick={onNewRide} variant="outline" className="w-full" size="lg">
              New Ride
            </Button>
          </>
        ) : (
          <>
            <p className="text-center text-sm text-gray-600">Please select a rating</p>
            <Button onClick={onNewRide} className="w-full" size="lg">
              Continue Without Rating
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
