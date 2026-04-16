import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import Layout from '@/shared/components/Layout';
import { ArrowLeft } from 'lucide-react';

/**
 * RideStatus - Booking Status Page
 * Shows the status of a booking (archived, not actively used in new ride feature)
 */
export default function RideStatus() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>

        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">Status Pesanan</h1>
          <p className="text-gray-600 mb-4">
            ID Pesanan: <span className="font-mono font-semibold">{id}</span>
          </p>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
            <p className="text-sm text-blue-800">
              ℹ️ Fitur pelacakan real-time sedang dikembangkan. Gunakan fitur booking ride baru untuk pengalaman terbaik.
            </p>
          </div>

          <Button onClick={() => navigate('/ride/book')} className="w-full">
            Pesan Ride Baru
          </Button>
        </Card>
      </div>
    </Layout>
  );
}
