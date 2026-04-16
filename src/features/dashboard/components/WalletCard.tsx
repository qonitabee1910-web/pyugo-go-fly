/**
 * Wallet Card Component
 * Displays user wallet balance and quick payment options
 */

import { Wallet, Plus, Send } from 'lucide-react';

export function WalletCard() {
  const balance = 250000; // Mock balance in IDR

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 text-white shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold flex items-center gap-2">
          <Wallet size={18} />
          Dompet PYU-GO
        </h3>
        <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">Aktif</span>
      </div>

      {/* Balance */}
      <div className="mb-6">
        <p className="text-sm opacity-90 mb-1">Saldo Anda</p>
        <h2 className="text-3xl font-bold">
          Rp {balance.toLocaleString('id-ID')}
        </h2>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 transition-all px-3 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium">
          <Plus size={16} />
          Top Up
        </button>
        <button className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 transition-all px-3 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium">
          <Send size={16} />
          Kirim
        </button>
      </div>

      {/* Usage Info */}
      <div className="mt-4 pt-4 border-t border-white border-opacity-20">
        <div className="flex justify-between text-xs opacity-80">
          <span>Transaksi bulan ini</span>
          <span>Rp 2.500.000</span>
        </div>
      </div>
    </div>
  );
}
