import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Phone, Car, Bike, UserRound, LucideIcon } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Card, CardContent } from '@/shared/ui/card';
import Layout from '@/shared/components/Layout';
import { useAuth } from '@/features/auth/AuthContext';
import { supabase } from '@/shared/integrations/supabase/client';
import { rideServices, dummyDrivers, formatRupiah } from '@/shared/data/dummy';
import { useToast } from '@/shared/hooks/use-toast';

const serviceIcons: Record<string, LucideIcon> = {
  bike: Bike,
  'user-round': UserRound,
  car: Car,
};

export default function RideBook() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const pickup = searchParams.get('pickup') || '';
  const destination = searchParams.get('dest') || '';
  const serviceId = searchParams.get('service') || '';
  const distance = parseInt(searchParams.get('distance') || '0');
  const price = parseInt(searchParams.get('price') || '0');

  const service = rideServices.find(s => s.id === serviceId);
  const driver = useMemo(() => {
    // For "women" service, pick female drivers
    if (service?.type === 'women') {
      const femaleDrivers = dummyDrivers.filter(d => ['Siti Nurhaliza', 'Dewi Lestari'].includes(d.name));
      return femaleDrivers[Math.floor(Math.random() * femaleDrivers.length)];
    }
    // For car service, pick drivers with car
    if (service?.type === 'car') {
      const carDrivers = dummyDrivers.filter(d => d.vehicle.includes('Toyota'));
      return carDrivers[Math.floor(Math.random() * carDrivers.length)];
    }
    return dummyDrivers[Math.floor(Math.random() * dummyDrivers.length)];
  }, [service]);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const Icon = serviceIcons[service?.icon || 'car'] || Car;

  const handleBook = async () => {
    if (!user) { navigate('/login'); return; }
    if (!name.trim()) { toast({ title: 'Masukkan nama penumpang', variant: 'destructive' }); return; }
    if (!phone.trim() || phone.length < 10) { toast({ title: 'Masukkan nomor HP yang valid', variant: 'destructive' }); return; }

    setLoading(true);
    const code = `PYU-RDE-${Date.now().toString(36).toUpperCase()}`;
    const { data, error } = await supabase.from('bookings').insert({
      user_id: user.id,
      code,
      type: 'ride',
      status: 'dikonfirmasi',
      details: `${service?.name} — ${pickup} → ${destination} (${distance} km) — Driver: ${driver.name}`,
      guest_name: name,
      total_price: price,
    }).select('id').single();

    setLoading(false);
    if (error) {
      toast({ title: 'Gagal memesan', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Ride berhasil dipesan!' });
      navigate(`/ride/status/${data.id}`);
    }
  };

  if (!service) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Layanan tidak ditemukan.</p>
          <Button variant="link" onClick={() => navigate('/ride')}>Kembali</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold mb-6">Konfirmasi Ride</h1>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Route Info */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold">{service.name}</p>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  <span>{pickup}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span>{destination}</span>
                </div>
                <p className="text-muted-foreground">Estimasi jarak: {distance} km</p>
              </div>
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <span className="text-muted-foreground">Total</span>
                <span className="text-xl font-bold text-primary">{formatRupiah(price)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Driver Info */}
          <Card>
            <CardContent className="p-5">
              <p className="font-semibold mb-3">Driver Anda</p>
              <div className="flex items-center gap-4">
                <img src={driver.photo} alt={driver.name} className="h-14 w-14 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="font-bold">{driver.name}</p>
                  <p className="text-sm text-muted-foreground">{driver.vehicle} • {driver.plateNumber}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{driver.rating}</span>
                  </div>
                </div>
                <a href={`tel:${driver.phone}`} className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="h-4 w-4 text-primary" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Passenger Form */}
          <Card>
            <CardContent className="p-5 space-y-3">
              <p className="font-semibold">Data Penumpang</p>
              <Input placeholder="Nama penumpang" value={name} onChange={(e) => setName(e.target.value)} />
              <Input placeholder="Nomor HP" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </CardContent>
          </Card>

          <Button className="w-full" size="lg" disabled={loading} onClick={handleBook}>
            {loading ? 'Memproses...' : 'Pesan Ride'}
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
}
