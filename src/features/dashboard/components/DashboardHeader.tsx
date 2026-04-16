/**
 * Dashboard Header Component
 * Displays user profile, notifications, and menu toggle
 */

import { User } from '@supabase/supabase-js';
import { Menu, Bell } from 'lucide-react';

interface DashboardHeaderProps {
  user: User;
  onMenuOpen: () => void;
}

export function DashboardHeader({ user, onMenuOpen }: DashboardHeaderProps) {
  const avatar = user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || 'User')}&background=random`;

  return (
    <header className="sticky top-0 bg-white border-b z-30">
      <div className="flex items-center justify-between px-4 py-4">
        {/* Logo and Branding */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900">PYU-GO</h1>
            <p className="text-xs text-gray-500">Super App</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Menu Toggle */}
          <button
            onClick={onMenuOpen}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={20} className="text-gray-600" />
          </button>

          {/* User Avatar */}
          <img
            src={avatar}
            alt={user.user_metadata?.full_name || 'User'}
            className="w-10 h-10 rounded-full border-2 border-gray-200"
          />
        </div>
      </div>
    </header>
  );
}
