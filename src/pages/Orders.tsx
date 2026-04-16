import { Hotel, Bus, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { dummyBookings, formatRupiah, type Booking } from '@/data/dummy';

const statusConfig: Record<Booking['status'], { label: string; color: string; icon: any }> = {
  menunggu: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
  dikonfirmasi: { label: 'Dikonfirmasi', color: 'bg-blue-100 text-blue-800', icon: Clock },
  selesai: { label: 'Selesai', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  dibatalkan: { label: 'Dibatalkan', color: 'bg-red-100 text-red-800', icon: XCircle },
};

export default function Orders() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Riwayat Pesanan</h1>

        <div className="space-y-4">
          {dummyBookings.map((booking) => {
            const status = statusConfig[booking.status];
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
                        <p className="text-xs text-muted-foreground mt-1">Tanggal: {booking.date} • Tamu: {booking.guestName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{formatRupiah(booking.totalPrice)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
