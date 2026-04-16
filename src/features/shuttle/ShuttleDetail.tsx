import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Check } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';
import Layout from '@/shared/components/Layout';
import { shuttles, formatRupiah } from '@/shared/data/dummy';
import { toast } from 'sonner';
import { useAuth } from '@/features/auth/AuthContext';
import { supabase } from '@/shared/integrations/supabase/client';

export default function ShuttleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const shuttle = shuttles.find((s) => s.id === id);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [booking, setBooking] = useState(false);

  if (!shuttle) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-lg text-muted-foreground">Shuttle tidak ditemukan.</p>
          <Button variant="link" onClick={() => navigate('/shuttle')}>Kembali ke pencarian</Button>
        </div>
      </Layout>
    );
  }

  const toggleSeat = (seat: number) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const occupiedSeats = Array.from({ length: shuttle.totalSeats - shuttle.seatsAvailable }, (_, i) => i + 1);

  const handleBooking = async () => {
    if (!user) { toast.error('Silakan login terlebih dahulu'); navigate('/login'); return; }
    if (selectedSeats.length === 0) { toast.error('Silakan pilih kursi'); return; }
    if (!passengerName || !passengerPhone) { toast.error('Lengkapi data penumpang'); return; }

    setBooking(true);
    const code = 'PYU-SHT-' + Date.now().toString().slice(-8);
    const { error } = await supabase.from('bookings').insert({
      user_id: user.id,
      code,
      type: 'shuttle',
      details: `${shuttle.operator} ${shuttle.origin} → ${shuttle.destination} — ${selectedSeats.length} kursi (${selectedSeats.join(', ')})`,
      guest_name: passengerName,
      total_price: shuttle.price * selectedSeats.length,
    });
    setBooking(false);

    if (error) { toast.error('Gagal memesan: ' + error.message); return; }
    toast.success(`Pemesanan berhasil! Kode: ${code}`);
    navigate('/pesanan');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4 gap-1">
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-2xl font-bold">{shuttle.operator}</h1>
                  <Badge variant="secondary">{shuttle.type}</Badge>
                </div>
                <div className="flex items-center gap-6 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{shuttle.departureTime}</p>
                    <p className="text-sm text-muted-foreground">{shuttle.origin}</p>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <p className="text-sm text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {shuttle.duration}</p>
                    <div className="w-full h-0.5 bg-primary/30 relative my-2">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary" />
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{shuttle.arrivalTime}</p>
                    <p className="text-sm text-muted-foreground">{shuttle.destination}</p>
                  </div>
                </div>
                <h3 className="font-semibold mb-2">Fasilitas</h3>
                <div className="flex flex-wrap gap-2">
                  {shuttle.facilities.map((f) => (
                    <Badge key={f} variant="outline" className="gap-1"><Check className="h-3 w-3" /> {f}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">Pilih Kursi</CardTitle></CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6 text-xs justify-center bg-muted/30 p-3 rounded-lg">
                  <div className="flex items-center gap-1.5"><div className="h-4 w-4 rounded bg-muted border" /> Tersedia</div>
                  <div className="flex items-center gap-1.5"><div className="h-4 w-4 rounded bg-primary" /> Dipilih</div>
                  <div className="flex items-center gap-1.5"><div className="h-4 w-4 rounded bg-muted-foreground/30" /> Terisi</div>
                </div>
                
                <div className="max-w-[280px] mx-auto bg-muted/10 p-4 rounded-xl border border-dashed">
                  <div className="flex justify-end mb-6">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground uppercase">Sopir</div>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: Math.ceil(shuttle.totalSeats / 4) * 4 }, (_, i) => {
                      const seatNum = i + 1;
                      const isAisle = (i + 1) % 5 === 3;
                      
                      if (isAisle) return <div key={`aisle-${i}`} className="h-10" />;
                      
                      // Map actual seat number (skipping aisle)
                      const actualSeatIdx = i - Math.floor(i / 5);
                      const actualSeatNum = actualSeatIdx + 1;
                      
                      if (actualSeatNum > shuttle.totalSeats) return <div key={`empty-${i}`} className="h-10" />;
                      
                      const isOccupied = occupiedSeats.includes(actualSeatNum);
                      const isSelected = selectedSeats.includes(actualSeatNum);
                      
                      return (
                        <button
                          key={actualSeatNum}
                          disabled={isOccupied}
                          onClick={() => toggleSeat(actualSeatNum)}
                          className={`h-10 w-10 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                            isOccupied ? 'bg-muted-foreground/20 cursor-not-allowed text-muted-foreground/50'
                            : isSelected ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105'
                            : 'bg-background border border-border hover:border-primary hover:text-primary'
                          }`}
                        >
                          {actualSeatNum}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-20">
              <CardHeader><CardTitle className="text-lg">Detail Pemesanan</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Nama Penumpang</label>
                  <Input value={passengerName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassengerName(e.target.value)} placeholder="Nama sesuai KTP" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">No. Telepon</label>
                  <Input value={passengerPhone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassengerPhone(e.target.value)} placeholder="+62..." />
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rute</span>
                    <span className="font-medium">{shuttle.origin} → {shuttle.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kursi</span>
                    <span className="font-medium">{selectedSeats.length > 0 ? selectedSeats.join(', ') : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Harga/kursi</span>
                    <span className="font-medium">{formatRupiah(shuttle.price)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span className="text-primary">{formatRupiah(shuttle.price * selectedSeats.length)}</span>
                  </div>
                </div>
                <Button className="w-full" size="lg" onClick={handleBooking} disabled={selectedSeats.length === 0 || booking}>
                  {booking ? 'Memproses...' : 'Pesan Sekarang'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
