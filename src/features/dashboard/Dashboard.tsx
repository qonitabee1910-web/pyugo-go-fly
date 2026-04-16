/**
 * PYU-GO Dashboard - Mobile-First Super App
 * Main dashboard with quick access to all services
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DashboardHeader } from './components/DashboardHeader';
import { QuickServices } from './components/QuickServices';
import { RecentBookings } from './components/RecentBookings';
import { WalletCard } from './components/WalletCard';
import { DashboardMenu } from './components/DashboardMenu';
import Navbar from '@/shared/components/Navbar';

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Fixed Header */}
      <DashboardHeader user={user} onMenuOpen={() => setShowMenu(true)} />

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Greeting Section */}
        <section className="px-4 py-6 bg-white border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            Selamat datang, {user.user_metadata?.full_name?.split(' ')[0] || 'Pengguna'}!
          </h2>
          <p className="text-sm text-gray-600 mt-1">Apa yang ingin kamu lakukan hari ini?</p>
        </section>

        {/* Quick Services */}
        <section className="px-4 py-6">
          <QuickServices />
        </section>

        {/* Wallet Card */}
        <section className="px-4 py-4">
          <WalletCard />
        </section>

        {/* Recent Bookings */}
        <section className="px-4 py-6">
          <RecentBookings />
        </section>

        {/* Promotional Banner */}
        <section className="px-4 py-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white shadow-md">
            <h3 className="font-semibold text-lg mb-2">🎉 Promo Spesial Bulan Ini</h3>
            <p className="text-sm mb-3">Dapatkan diskon hingga 50% untuk pesanan pertama Anda!</p>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100">
              Lihat Promo
            </button>
          </div>
        </section>
      </div>

      {/* Navigation Bar */}
      <Navbar />

      {/* Sidebar Menu */}
      {showMenu && (
        <div className="fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowMenu(false)}
          />
          <DashboardMenu user={user} onClose={() => setShowMenu(false)} />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
