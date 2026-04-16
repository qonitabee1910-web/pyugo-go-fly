import { useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import { hotels, formatRupiah } from '@/data/dummy';

export default function HotelSearch() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const city = params.get('city') || '';
  const [sort, setSort] = useState('price-asc');
  const [starFilter, setStarFilter] = useState<number | null>(null);

  const filtered = useMemo(() => {
    let list = hotels;
    if (city) list = list.filter((h) => h.city.toLowerCase().includes(city.toLowerCase()));
    if (starFilter) list = list.filter((h) => h.stars >= starFilter);
    list = [...list].sort((a, b) => {
      if (sort === 'price-asc') return a.pricePerNight - b.pricePerNight;
      if (sort === 'price-desc') return b.pricePerNight - a.pricePerNight;
      if (sort === 'rating') return b.rating - a.rating;
      return 0;
    });
    return list;
  }, [city, sort, starFilter]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-1">
          Hasil Pencarian Hotel {city && `di ${city}`}
        </h1>
        <p className="text-muted-foreground mb-6">{filtered.length} hotel ditemukan</p>

        <div className="flex flex-wrap gap-3 mb-6">
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[180px]">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price-asc">Harga Terendah</SelectItem>
              <SelectItem value="price-desc">Harga Tertinggi</SelectItem>
              <SelectItem value="rating">Rating Tertinggi</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            {[3, 4, 5].map((s) => (
              <Button
                key={s}
                variant={starFilter === s ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStarFilter(starFilter === s ? null : s)}
                className="gap-1"
              >
                {s} <Star className="h-3 w-3 fill-current" />
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {filtered.map((hotel) => (
            <div
              key={hotel.id}
              onClick={() => navigate(`/hotel/${hotel.id}`)}
              className="bg-card rounded-xl border shadow-sm overflow-hidden flex flex-col md:flex-row cursor-pointer hover:shadow-md transition-shadow"
            >
              <img src={hotel.image} alt={hotel.name} className="w-full md:w-64 h-48 md:h-auto object-cover" />
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <Badge variant="secondary" className="text-xs mb-1">{hotel.type}</Badge>
                      <h3 className="text-lg font-bold">{hotel.name}</h3>
                    </div>
                    <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-lg text-sm font-semibold">
                      <Star className="h-3.5 w-3.5 fill-primary" /> {hotel.rating}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                    <MapPin className="h-3.5 w-3.5" /> {hotel.address}, {hotel.city}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {hotel.facilities.slice(0, 4).map((f) => (
                      <Badge key={f} variant="outline" className="text-xs font-normal">{f}</Badge>
                    ))}
                    {hotel.facilities.length > 4 && (
                      <Badge variant="outline" className="text-xs font-normal">+{hotel.facilities.length - 4}</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Mulai dari</p>
                    <p className="text-xl font-bold text-primary">{formatRupiah(hotel.pricePerNight)}</p>
                    <p className="text-xs text-muted-foreground">/malam</p>
                  </div>
                  <Button size="sm">Lihat Detail</Button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg">Tidak ada hotel ditemukan.</p>
              <Button variant="link" onClick={() => navigate('/')}>Kembali ke beranda</Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
