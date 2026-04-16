/**
 * Dashboard Menu Component
 * Sidebar menu with user profile and settings
 */

import { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import {
  User as UserIcon,
  CreditCard,
  Settings,
  HelpCircle,
  FileText,
  LogOut,
  X,
  Heart,
  MapPin,
} from 'lucide-react';

interface DashboardMenuProps {
  user: User;
  onClose: () => void;
}

export function DashboardMenu({ user, onClose }: DashboardMenuProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const avatar = user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || 'User')}&background=random`;

  const menuItems = [
    {
      label: 'Profil Saya',
      icon: UserIcon,
      action: () => {
        navigate('/profile');
        onClose();
      },
    },
    {
      label: 'Pembayaran',
      icon: CreditCard,
      action: () => {
        navigate('/payments');
        onClose();
      },
    },
    {
      label: 'Alamat Tersimpan',
      icon: MapPin,
      action: () => {
        navigate('/addresses');
        onClose();
      },
    },
    {
      label: 'Favorit',
      icon: Heart,
      action: () => {
        navigate('/favorites');
        onClose();
      },
    },
    {
      label: 'Pengaturan',
      icon: Settings,
      action: () => {
        navigate('/settings');
        onClose();
      },
    },
    {
      label: 'Bantuan & FAQ',
      icon: HelpCircle,
      action: () => {
        navigate('/bantuan');
        onClose();
      },
    },
    {
      label: 'Ketentuan Layanan',
      icon: FileText,
      action: () => {
        navigate('/terms');
        onClose();
      },
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Menu Panel */}
      <div className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b">
          <div className="flex items-center justify-between p-4">
            <h2 className="font-bold text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={avatar}
              alt={user.user_metadata?.full_name || 'User'}
              className="w-12 h-12 rounded-full border-2 border-gray-200"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {user.user_metadata?.full_name || 'Pengguna'}
              </h3>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium text-sm transition-colors">
            Edit Profil
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.action}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors text-left"
              >
                <Icon size={20} className="text-gray-600 flex-shrink-0" />
                <span className="text-gray-900 font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="border-t mx-2" />

        {/* Logout Button */}
        <div className="p-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-lg transition-colors text-left"
          >
            <LogOut size={20} className="text-red-600 flex-shrink-0" />
            <span className="text-red-600 font-medium text-sm">Keluar</span>
          </button>
        </div>

        {/* Footer Info */}
        <div className="p-4 text-xs text-gray-500 border-t">
          <p>Versi 1.0.0</p>
          <p className="mt-1">© 2026 PYU-GO Super App</p>
        </div>
      </div>
    </div>
  );
}
