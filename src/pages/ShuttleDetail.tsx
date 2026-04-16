import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/Layout';
import { shuttles, formatRupiah } from '@/data/dummy';
import { toast } from 'sonner';

export default function ShuttleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const shuttle = shuttles.find((s) => s.id === id);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');

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

  const handleBooking = () => {
    if (selectedSeats.length === 0) { toast.error('Silakan pilih kursi'); return; }
    if (!passengerName || !passengerPhone) { toast.error('Lengkapi data penumpang'); return; }
    toast.success('Pemesanan berhasil! Kode booking: PYU-SHT-' + Date.now().toString().slice(-8));
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
            {/* Info */}
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
                    <Badge key={f} variant="outline" className="gap-1">
                      <Check className="h-3 w-3" /> {f}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Seat Map */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pilih Kursi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-4 text-xs">
                  <div className="flex items-center gap-1"><div className="h-4 w-4 rounded bg-muted border" /> Tersedia</div>
                  <div className="flex items-center gap-1"><div className="h-4 w-4 rounded bg-primary" /> Dipilih</div>
                  <div className="flex items-center gap-1"><div className="h-4 w-4 rounded bg-muted-foreground/30" /> Terisi</div>
                </div>
                <div className="grid grid-cols-4 gap-2 max-w-xs">
                  {Array.from({ length: shuttle.totalSeats }, (_, i) => i + 1).map((seat) => {
                    const isOccupied = occupiedSeats.includes(seat);
                    const isSelected = selectedSeats.includes(seat);
                    return (
                      <button
                        key={seat}
                        disabled={isOccupied}
                        onClick={() => toggleSeat(seat)}
                        className={`h-10 rounded-md text-sm font-medium transition-all ${
                          isOccupied
                            ? 'bg-muted-foreground/30 cursor-not-allowed text-muted-foreground'
                            : isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted border hover:border-primary'
                        }`}
                      >
                        {seat}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking form */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-lg">Detail Pemesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Nama Penumpang</label>
                  <Input value={passengerName} onChange={(e) => setPassengerName(e.target.value)} placeholder="Nama sesuai KTP" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">No. Telepon</label>
                  <Input value={passengerPhone} onChange={(e) => setPassengerPhone(e.target.value)} placeholder="+62..." />
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

                <Button className="w-full" size="lg" onClick={handleBooking} disabled={selectedSeats.length === 0}>
                  Pesan Sekarang
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
