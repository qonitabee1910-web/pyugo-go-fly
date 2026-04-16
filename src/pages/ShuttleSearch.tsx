import { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Clock, MapPin, Users, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import { shuttles, formatRupiah } from '@/data/dummy';

export default function ShuttleSearch() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const origin = params.get('origin') || '';
  const dest = params.get('dest') || '';
  const [sort, setSort] = useState('price-asc');
  const [operatorFilter, setOperatorFilter] = useState('all');

  const operators = [...new Set(shuttles.map((s) => s.operator))];

  const filtered = useMemo(() => {
    let list = shuttles;
    if (origin) list = list.filter((s) => s.origin.toLowerCase().includes(origin.toLowerCase()));
    if (dest) list = list.filter((s) => s.destination.toLowerCase().includes(dest.toLowerCase()));
    if (operatorFilter !== 'all') list = list.filter((s) => s.operator === operatorFilter);
    list = [...list].sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'time') return a.departureTime.localeCompare(b.departureTime);
      return 0;
    });
    return list;
  }, [origin, dest, sort, operatorFilter]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-1">
          Hasil Pencarian Shuttle {origin && dest ? `${origin} → ${dest}` : ''}
        </h1>
        <p className="text-muted-foreground mb-6">{filtered.length} shuttle ditemukan</p>

        <div className="flex flex-wrap gap-3 mb-6">
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[180px]">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">Harga Terendah</SelectItem>
              <SelectItem value="price-desc">Harga Tertinggi</SelectItem>
              <SelectItem value="time">Waktu Berangkat</SelectItem>
            </SelectContent>
          </Select>

          <Select value={operatorFilter} onValueChange={setOperatorFilter}>
            <SelectTrigger className="w-[180px]">
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

        <div className="grid gap-4">
          {filtered.map((shuttle) => (
            <div
              key={shuttle.id}
              className="bg-card rounded-xl border shadow-sm p-5 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/shuttle/${shuttle.id}`)}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-lg">{shuttle.operator}</span>
                    <Badge variant="secondary" className="text-xs">{shuttle.type}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <p className="font-bold text-lg">{shuttle.departureTime}</p>
                      <p className="text-muted-foreground text-xs">{shuttle.origin}</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <p className="text-xs text-muted-foreground">{shuttle.duration}</p>
                      <div className="w-full h-px bg-border relative my-1">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary" />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary" />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-lg">{shuttle.arrivalTime}</p>
                      <p className="text-muted-foreground text-xs">{shuttle.destination}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {shuttle.facilities.map((f) => (
                      <Badge key={f} variant="outline" className="text-xs font-normal">{f}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" /> {shuttle.seatsAvailable} kursi tersedia
                  </p>
                  <p className="text-xl font-bold text-primary">{formatRupiah(shuttle.price)}</p>
                  <p className="text-xs text-muted-foreground">/orang</p>
                  <Button size="sm">Pilih</Button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg">Tidak ada shuttle ditemukan.</p>
              <Button variant="link" onClick={() => navigate('/')}>Kembali ke beranda</Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
