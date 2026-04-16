import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/Layout';
import { hotels, formatRupiah } from '@/data/dummy';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const hotel = hotels.find((h) => h.id === id);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [imgIdx, setImgIdx] = useState(0);
  const [booking, setBooking] = useState(false);

  if (!hotel) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-lg text-muted-foreground">Hotel tidak ditemukan.</p>
          <Button variant="link" onClick={() => navigate('/hotel')}>Kembali ke pencarian</Button>
        </div>
      </Layout>
    );
  }

  const room = hotel.rooms.find((r) => r.id === selectedRoom);

  const handleBooking = async () => {
    if (!user) { toast.error('Silakan login terlebih dahulu'); navigate('/login'); return; }
    if (!selectedRoom) { toast.error('Silakan pilih tipe kamar'); return; }
    if (!guestName || !guestEmail || !guestPhone) { toast.error('Lengkapi data tamu'); return; }
    if (!room) return;

    setBooking(true);
    const code = 'PYU-HTL-' + Date.now().toString().slice(-8);
    const { error } = await supabase.from('bookings').insert({
      user_id: user.id,
      code,
      type: 'hotel',
      details: `${hotel.name} — ${room.name}`,
      guest_name: guestName,
      total_price: room.price,
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
            <div className="rounded-xl overflow-hidden">
              <img src={hotel.images[imgIdx]} alt={hotel.name} className="w-full h-64 md:h-96 object-cover" />
              {hotel.images.length > 1 && (
                <div className="flex gap-2 p-2 bg-muted">
                  {hotel.images.map((img, i) => (
                    <img key={i} src={img} alt="" onClick={() => setImgIdx(i)}
                      className={`h-16 w-24 rounded-md object-cover cursor-pointer border-2 transition-all ${i === imgIdx ? 'border-primary' : 'border-transparent opacity-60'}`} />
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{hotel.type}</Badge>
                <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                  <Star className="h-4 w-4 fill-primary" /> {hotel.rating}
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">{hotel.name}</h1>
              <p className="text-muted-foreground flex items-center gap-1 text-sm mb-4">
                <MapPin className="h-4 w-4" /> {hotel.address}, {hotel.city}
              </p>
              <p className="leading-relaxed">{hotel.description}</p>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-3">Fasilitas</h2>
              <div className="flex flex-wrap gap-2">
                {hotel.facilities.map((f) => (
                  <Badge key={f} variant="outline" className="gap-1 py-1.5 px-3">
                    <Check className="h-3 w-3" /> {f}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-3">Pilih Kamar</h2>
              <div className="space-y-3">
                {hotel.rooms.map((r) => (
                  <Card key={r.id}
                    className={`cursor-pointer transition-all ${selectedRoom === r.id ? 'ring-2 ring-primary' : 'hover:border-primary/50'}`}
                    onClick={() => setSelectedRoom(r.id)}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{r.name}</p>
                        <p className="text-xs text-muted-foreground">Maks {r.capacity} tamu</p>
                        <div className="flex gap-1 mt-1">
                          {r.facilities.map((f) => (
                            <Badge key={f} variant="outline" className="text-[10px] py-0">{f}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary text-lg">{formatRupiah(r.price)}</p>
                        <p className="text-xs text-muted-foreground">/malam</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Card className="sticky top-20">
              <CardHeader><CardTitle className="text-lg">Detail Pemesanan</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Nama Lengkap</label>
                  <Input value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="Nama sesuai KTP" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Email</label>
                  <Input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="email@contoh.com" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">No. Telepon</label>
                  <Input value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder="+62..." />
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hotel</span>
                    <span className="font-medium">{hotel.name}</span>
                  </div>
                  {room && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Kamar</span>
                        <span className="font-medium">{room.name}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-base font-bold">
                        <span>Total</span>
                        <span className="text-primary">{formatRupiah(room.price)}</span>
                      </div>
                    </>
                  )}
                </div>
                <Button className="w-full" size="lg" onClick={handleBooking} disabled={!selectedRoom || booking}>
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
