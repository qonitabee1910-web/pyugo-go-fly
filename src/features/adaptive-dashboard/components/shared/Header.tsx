import { useState } from 'react';
import { Bell, MapPin } from 'lucide-react';
import { mockCurrentLocation } from '../../store/locationStore';
import { useAuth } from '@/features/auth/AuthContext';

interface SharedHeaderProps {
  isMobile?: boolean;
}

export const SharedHeader = ({ isMobile = false }: SharedHeaderProps) => {
  const { user } = useAuth();
  const [unreadNotifications] = useState(3);
  const userEmail = user?.email || '';
  const userName = user?.user_metadata?.full_name || userEmail?.split('@')[0] || 'User';
  const userInitial = userName?.charAt(0).toUpperCase() || 'U';

  if (isMobile) {
    return (
      <div className="sticky top-0 z-40 bg-white border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">PYU-GO</h1>
            <p className="text-xs text-gray-500">Super App</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition">
              <Bell size={20} className="text-gray-700" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            <button className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
              {userInitial}
            </button>
          </div>
        </div>

        {/* Location Bar */}
        <div className="px-4 py-2 border-t">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <MapPin size={14} className="text-blue-600 flex-shrink-0" />
            <span className="truncate">
              {mockCurrentLocation?.address || 'Tentukan lokasi Anda'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-40 bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900">PYU-GO</h1>
            <p className="text-xs text-gray-500">Super App</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="flex items-center gap-8">
          <nav className="flex items-center gap-6">
            <button className="text-sm font-medium text-gray-700 hover:text-blue-600 transition">
              Naik
            </button>
            <button className="text-sm font-medium text-gray-700 hover:text-blue-600 transition">
              Shuttle
            </button>
            <button className="text-sm font-medium text-gray-700 hover:text-blue-600 transition">
              Pesanan
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition">
              <Bell size={20} className="text-gray-700" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            <div className="flex items-center gap-2 pl-4 border-l">
              <div>
                <p className="text-sm font-medium text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
              </div>
              <button className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                {userInitial}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Location Bar */}
      <div className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4 text-sm">
          <MapPin size={16} className="text-blue-600 flex-shrink-0" />
          <span className="text-gray-600">
            Lokasi: {mockCurrentLocation?.address || 'Tentukan lokasi Anda'}
          </span>
        </div>
      </div>
    </div>
  );
};
