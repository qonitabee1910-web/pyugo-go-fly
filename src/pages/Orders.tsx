import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hotel, Bus, Clock, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatRupiah } from '@/data/dummy';

type BookingStatus = 'menunggu' | 'dikonfirmasi' | 'selesai' | 'dibatalkan';

const statusConfig: Record<BookingStatus, { label: string; color: string; icon: any }> = {
  menunggu: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
  dikonfirmasi: { label: 'Dikonfirmasi', color: 'bg-blue-100 text-blue-800', icon: Clock },
  selesai: { label: 'Selesai', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  dibatalkan: { label: 'Dibatalkan', color: 'bg-red-100 text-red-800', icon: XCircle },
};

interface Booking {
  id: string;
  code: string;
  type: string;
  status: string;
  details: string;
  guest_name: string;
  total_price: number;
  booking_date: string;
}

export default function Orders() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }

    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setBookings(data);
      setLoading(false);
    };
    fetchBookings();
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Riwayat Pesanan</h1>

        {bookings.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg mb-2">Belum ada pesanan.</p>
            <Button variant="link" onClick={() => navigate('/')}>Mulai pesan sekarang</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const status = statusConfig[booking.status as BookingStatus] || statusConfig.menunggu;
              const StatusIcon = status.icon;
              return (
                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          {booking.type === 'hotel' ? <Hotel className="h-5 w-5 text-primary" /> : <Bus className="h-5 w-5 text-primary" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold">{booking.code}</p>
                            <Badge className={`${status.color} border-0 gap-1`}>
                              <StatusIcon className="h-3 w-3" /> {status.label}
                            </Badge>
                          </div>
                          <p className="text-sm">{booking.details}</p>
                          <p className="text-xs text-muted-foreground mt-1">Tanggal: {booking.booking_date} • Tamu: {booking.guest_name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">{formatRupiah(booking.total_price)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
