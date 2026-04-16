import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, MapPin, Car, Phone, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { dummyDrivers, formatRupiah } from '@/data/dummy';
import { useToast } from '@/hooks/use-toast';

const steps = [
  { key: 'searching', label: 'Mencari Driver...', duration: 3000 },
  { key: 'found', label: 'Driver Ditemukan', duration: 2000 },
  { key: 'otw', label: 'Driver Menuju Lokasi Anda', duration: 4000 },
  { key: 'arrived', label: 'Driver Tiba', duration: 3000 },
  { key: 'trip', label: 'Dalam Perjalanan', duration: 5000 },
  { key: 'done', label: 'Perjalanan Selesai', duration: 0 },
];

interface BookingData {
  id: string;
  code: string;
  details: string;
  total_price: number;
  status: string;
}

export default function RideStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [stepIdx, setStepIdx] = useState(0);
  const [cancelled, setCancelled] = useState(false);

  // Pick a random driver for display
  const driver = dummyDrivers[Math.floor(Math.random() * dummyDrivers.length)];

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }

    const fetchBooking = async () => {
      const { data } = await supabase.from('bookings').select('*').eq('id', id).single();
      if (data) {
        setBooking(data);
        if (data.status === 'dibatalkan') setCancelled(true);
        if (data.status === 'selesai') setStepIdx(steps.length - 1);
      }
      setLoading(false);
    };
    fetchBooking();
  }, [id, user, authLoading, navigate]);

  // Auto-advance steps
  useEffect(() => {
    if (cancelled || stepIdx >= steps.length - 1) return;
    const timer = setTimeout(() => {
      setStepIdx(prev => prev + 1);
    }, steps[stepIdx].duration);
    return () => clearTimeout(timer);
  }, [stepIdx, cancelled]);

  // Mark as done when reaching last step
  useEffect(() => {
    if (stepIdx === steps.length - 1 && booking && !cancelled) {
      supabase.from('bookings').update({ status: 'selesai' }).eq('id', booking.id).then();
    }
  }, [stepIdx, booking, cancelled]);

  const handleCancel = async () => {
    if (!booking) return;
    await supabase.from('bookings').update({ status: 'dibatalkan' }).eq('id', booking.id);
    setCancelled(true);
    toast({ title: 'Ride dibatalkan' });
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!booking) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Pesanan tidak ditemukan.</p>
          <Button variant="link" onClick={() => navigate('/pesanan')}>Ke Riwayat Pesanan</Button>
        </div>
      </Layout>
    );
  }

  const currentStep = steps[stepIdx];
  const isDone = stepIdx === steps.length - 1;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <h1 className="text-2xl font-bold mb-6">Status Ride</h1>

        {cancelled ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-destructive" />
              </div>
              <p className="text-lg font-bold mb-1">Ride Dibatalkan</p>
              <p className="text-sm text-muted-foreground mb-4">Kode: {booking.code}</p>
              <Button onClick={() => navigate('/pesanan')}>Ke Riwayat Pesanan</Button>
            </CardContent>
          </Card>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {/* Progress Steps */}
            <Card>
              <CardContent className="p-5">
                <div className="space-y-3">
                  {steps.map((step, i) => (
                    <div key={step.key} className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition-all ${
                        i < stepIdx ? 'bg-primary text-primary-foreground' :
                        i === stepIdx ? 'bg-primary text-primary-foreground animate-pulse' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {i < stepIdx ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                      </div>
                      <span className={`text-sm ${i <= stepIdx ? 'font-medium' : 'text-muted-foreground'}`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Driver Info (show after found) */}
            {stepIdx >= 1 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card>
                  <CardContent className="p-5 flex items-center gap-4">
                    <img src={driver.photo} alt={driver.name} className="h-14 w-14 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="font-bold">{driver.name}</p>
                      <p className="text-sm text-muted-foreground">{driver.vehicle} • {driver.plateNumber}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm">{driver.rating}</span>
                      </div>
                    </div>
                    <a href={`tel:${driver.phone}`} className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="h-4 w-4 text-primary" />
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Booking Info */}
            <Card>
              <CardContent className="p-5 text-sm space-y-1">
                <p><span className="text-muted-foreground">Kode:</span> {booking.code}</p>
                <p><span className="text-muted-foreground">Detail:</span> {booking.details}</p>
                <p className="font-bold text-primary text-lg mt-2">{formatRupiah(booking.total_price)}</p>
              </CardContent>
            </Card>

            {/* Actions */}
            {isDone ? (
              <Button className="w-full" onClick={() => navigate('/pesanan')}>Lihat Riwayat Pesanan</Button>
            ) : stepIdx < 3 ? (
              <Button variant="destructive" className="w-full" onClick={handleCancel}>Batalkan Ride</Button>
            ) : null}
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
