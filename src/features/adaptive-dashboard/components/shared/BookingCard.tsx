import { MapPin, Clock, ChevronRight } from 'lucide-react';
import { Booking } from '../../store/bookingStore';
import { formatCurrency, getRelativeTime } from '../../utils/calculations';

interface BookingCardProps {
  booking: Booking;
  isMobile?: boolean;
  onClick?: () => void;
}

export const BookingCard = ({
  booking,
  isMobile = false,
  onClick,
}: BookingCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Selesai';
      case 'ongoing':
        return 'Berlangsung';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'ride':
        return '🚗';
      case 'shuttle':
        return '🚌';
      case 'hotel':
        return '🏨';
      default:
        return '📦';
    }
  };

  if (isMobile) {
    return (
      <div
        onClick={onClick}
        className="bg-white rounded-xl shadow-sm border p-4 active:scale-95 transition-transform cursor-pointer"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{getServiceIcon(booking.type)}</span>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">{booking.title}</h3>
              {booking.details && (
                <p className="text-xs text-gray-500 mt-1">{booking.details}</p>
              )}
            </div>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              booking.status
            )}`}
          >
            {getStatusLabel(booking.status)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
          <Clock size={14} />
          <span>{booking.time}</span>
          <span>•</span>
          <span>{booking.date}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <span className="text-sm font-semibold text-gray-900">
            {formatCurrency(booking.price)}
          </span>
          <ChevronRight size={16} className="text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border p-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{getServiceIcon(booking.type)}</span>
          <div>
            <h3 className="font-semibold text-gray-900">{booking.title}</h3>
            {booking.details && (
              <p className="text-sm text-gray-500 mt-0.5">{booking.details}</p>
            )}
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            booking.status
          )}`}
        >
          {getStatusLabel(booking.status)}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span>{booking.time}</span>
        </div>
        <span>•</span>
        <span>{booking.date}</span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t">
        <span className="text-lg font-bold text-gray-900">
          {formatCurrency(booking.price)}
        </span>
        <ChevronRight className="text-gray-400" />
      </div>
    </div>
  );
};
