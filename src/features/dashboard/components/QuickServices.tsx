/**
 * Quick Services Component
 * Main service cards for ride, shuttle, hotel, and help
 */

import { useNavigate } from 'react-router-dom';
import { Car, Bus, Hotel, HelpCircle, Gift } from 'lucide-react';

export function QuickServices() {
  const navigate = useNavigate();

  const services = [
    {
      id: 'ride',
      icon: Car,
      label: 'Naik',
      description: 'Pesan perjalanan',
      color: 'from-blue-500 to-blue-600',
      action: () => navigate('/ride/book'),
    },
    {
      id: 'shuttle',
      icon: Bus,
      label: 'Shuttle',
      description: 'Bus dan shuttle',
      color: 'from-purple-500 to-purple-600',
      action: () => navigate('/shuttle'),
    },
    {
      id: 'hotel',
      icon: Hotel,
      label: 'Hotel',
      description: 'Pesan penginapan',
      color: 'from-amber-500 to-amber-600',
      action: () => navigate('/hotel'),
    },
    {
      id: 'help',
      icon: HelpCircle,
      label: 'Bantuan',
      description: 'Hubungi support',
      color: 'from-green-500 to-green-600',
      action: () => navigate('/bantuan'),
    },
  ];

  return (
    <div>
      {/* Main Services Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <button
              key={service.id}
              onClick={service.action}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow active:scale-95 transform duration-150"
            >
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center mb-3 mx-auto`}
              >
                <Icon size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{service.label}</h3>
              <p className="text-xs text-gray-500 mt-1">{service.description}</p>
            </button>
          );
        })}
      </div>

      {/* Promo Banner */}
      <button className="w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0">
            <Gift size={20} className="text-white" />
          </div>
          <div className="text-left flex-1">
            <h3 className="font-semibold text-gray-900 text-sm">Kupon Diskon</h3>
            <p className="text-xs text-gray-500">Klaim reward Anda sekarang</p>
          </div>
          <span className="text-xs font-bold text-red-500 flex-shrink-0">➜</span>
        </div>
      </button>
    </div>
  );
}
