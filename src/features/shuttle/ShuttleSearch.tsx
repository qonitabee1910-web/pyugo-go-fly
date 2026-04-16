import { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Users, SlidersHorizontal, ArrowRight, Clock, MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Badge } from '@/shared/ui/badge';
import Layout from '@/shared/components/Layout';
import { shuttles, formatRupiah, Shuttle } from '@/shared/data/dummy';
import { ComponentStyles, PATTERNS, STATES } from '@/design-system';

export default function ShuttleSearch() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const origin = params.get('origin') || '';
  const dest = params.get('dest') || '';
  const [sort, setSort] = useState('price-asc');
  const [operatorFilter, setOperatorFilter] = useState('all');

  const operators = [...new Set(shuttles.map((s: Shuttle) => s.operator))];

  const filtered = useMemo(() => {
    let list = shuttles;
    if (origin) list = list.filter((s: Shuttle) => s.origin.toLowerCase().includes(origin.toLowerCase()));
    if (dest) list = list.filter((s: Shuttle) => s.destination.toLowerCase().includes(dest.toLowerCase()));
    if (operatorFilter !== 'all') list = list.filter((s: Shuttle) => s.operator === operatorFilter);
    list = [...list].sort((a: Shuttle, b: Shuttle) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'time') return a.departureTime.localeCompare(b.departureTime);
      return 0;
    });
    return list;
  }, [origin, dest, sort, operatorFilter]);

  return (
    <Layout>
      <div className={PATTERNS.pageContainer}>
        <div className={PATTERNS.responsivePadding}>
          {/* Header */}
          <div className="mb-8">
            <h1 className={ComponentStyles.typography.h1}>
              Hasil Pencarian Shuttle
            </h1>
            {origin && dest && (
              <p className={ComponentStyles.typography.bodySmall}>
                <MapPin size={16} className="inline mr-2" />
                {origin} <ArrowRight size={16} className="inline mx-2" /> {dest}
              </p>
            )}
            <p className={`${ComponentStyles.typography.body} text-gray-600 mt-2`}>
              {filtered.length} shuttle ditemukan
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">💰 Harga Terendah</SelectItem>
                <SelectItem value="price-desc">💸 Harga Tertinggi</SelectItem>
                <SelectItem value="time">🕐 Waktu Berangkat</SelectItem>
              </SelectContent>
            </Select>

            <Select value={operatorFilter} onValueChange={setOperatorFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Operator</SelectItem>
                {operators.map((op) => (
                  <SelectItem key={op} value={op}>{op}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results */}
          {filtered.length > 0 ? (
            <div className={PATTERNS.cardContainer}>
              {filtered.map((shuttle: Shuttle) => (
                <div
                  key={shuttle.id}
                  onClick={() => navigate(`/shuttle/${shuttle.id}`)}
                  className={`${ComponentStyles.card.base} cursor-pointer p-5 sm:p-6 active:scale-95 transition-all`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Operator Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className={ComponentStyles.typography.h4}>{shuttle.operator}</h3>
                        <Badge className={`text-xs ${
                          shuttle.type === 'AC' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {shuttle.type}
                        </Badge>
                      </div>

                      {/* Journey Timeline */}
                      <div className="flex items-center gap-4 mb-4">
                        {/* Departure */}
                        <div className="text-center">
                          <p className={`${ComponentStyles.typography.h4} text-gray-900`}>
                            {shuttle.departureTime}
                          </p>
                          <p className={ComponentStyles.typography.caption}>{shuttle.origin}</p>
                        </div>

                        {/* Duration */}
                        <div className="flex-1 flex flex-col items-center">
                          <p className={`${ComponentStyles.typography.caption} mb-2`}>
                            <Clock size={16} className="inline mr-1" />
                            {shuttle.duration}
                          </p>
                          <div className="w-full h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 relative">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-blue-600 border-2 border-white" />
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-blue-600 border-2 border-white" />
                          </div>
                        </div>

                        {/* Arrival */}
                        <div className="text-center">
                          <p className={`${ComponentStyles.typography.h4} text-gray-900`}>
                            {shuttle.arrivalTime}
                          </p>
                          <p className={ComponentStyles.typography.caption}>{shuttle.destination}</p>
                        </div>
                      </div>

                      {/* Facilities */}
                      <div className="flex flex-wrap gap-2">
                        {shuttle.facilities.map((facility: string) => (
                          <Badge key={facility} variant="outline" className="text-xs font-normal">
                            {facility}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Booking Info */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between sm:gap-6 lg:gap-2 py-4 sm:py-0 lg:py-0 border-t sm:border-t-0 lg:border-t-0 pt-4 sm:pt-0 lg:pt-0">
                      <div>
                        <p className={ComponentStyles.typography.caption}>
                          <Users size={16} className="inline mr-1" /> {shuttle.seatsAvailable} kursi tersedia
                        </p>
                      </div>

                      <div className="text-right">
                        <p className={`${ComponentStyles.typography.h3} text-blue-600 font-bold`}>
                          {formatRupiah(shuttle.price)}
                        </p>
                        <p className={ComponentStyles.typography.caption}>/orang</p>
                      </div>

                      <button
                        className={`${ComponentStyles.button.base} ${ComponentStyles.button.primary} ${ComponentStyles.button.md} w-full sm:w-auto lg:w-full`}
                      >
                        Pilih <ArrowRight size={16} className="ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={STATES.empty.container}>
              <div className="text-6xl mb-4">🚌</div>
              <h4 className={STATES.empty.title}>Tidak Ada Shuttle Ditemukan</h4>
              <p className={STATES.empty.description}>
                Coba ubah pilihan rute atau waktu perjalanan Anda
              </p>
              <button
                onClick={() => navigate('/')}
                className={`${ComponentStyles.button.base} ${ComponentStyles.button.primary} ${ComponentStyles.button.md}`}
              >
                Kembali ke Beranda
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
