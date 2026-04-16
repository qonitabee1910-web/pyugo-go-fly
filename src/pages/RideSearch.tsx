import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Bike, Car, UserRound, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { cities, rideServices, formatRupiah } from '@/data/dummy';

const serviceIcons: Record<string, any> = {
  bike: Bike,
  'user-round': UserRound,
  car: Car,
};

const getEstimatedDistance = () => Math.floor(Math.random() * 13) + 3;

export default function RideSearch() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pickup, setPickup] = useState(searchParams.get('pickup') || '');
  const [destination, setDestination] = useState(searchParams.get('dest') || '');
  const [distance, setDistance] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  useEffect(() => {
    if (pickup && destination) {
      setDistance(getEstimatedDistance());
    }
  }, [pickup, destination]);

  const handleSearch = () => {
    if (pickup && destination) {
      setDistance(getEstimatedDistance());
    }
  };

  const handleBook = () => {
    if (!selectedService || !distance) return;
    const service = rideServices.find(s => s.id === selectedService);
    if (!service) return;
    const price = service.pricePerKm * distance;
    navigate(`/ride/book?pickup=${encodeURIComponent(pickup)}&dest=${encodeURIComponent(destination)}&service=${selectedService}&distance=${distance}&price=${price}`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Pesan Ride</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Map */}
          <div className="lg:col-span-2">
            <div className="rounded-xl overflow-hidden h-[400px] border">
              <iframe
                title="Peta lokasi"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src="https://www.openstreetmap.org/export/embed.html?bbox=106.7%2C-6.3%2C106.95%2C-6.1&layer=mapnik&marker=-6.2088%2C106.8456"
              />
            </div>
          </div>

          {/* Right: Search & Services */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-green-500" />
                  <Input
                    placeholder="Lokasi jemput"
                    className="pl-9"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    list="city-list"
                  />
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-red-500" />
                  <Input
                    placeholder="Lokasi tujuan"
                    className="pl-9"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    list="city-list"
                  />
                </div>
                <Button className="w-full" onClick={handleSearch}>Cari Ride</Button>
              </CardContent>
            </Card>

            {distance && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <p className="text-sm text-muted-foreground mb-3">
                  Estimasi jarak: <span className="font-semibold text-foreground">{distance} km</span>
                </p>
                <div className="space-y-2">
                  {rideServices.map((service) => {
                    const Icon = serviceIcons[service.icon] || Car;
                    const price = service.pricePerKm * distance;
                    return (
                      <Card
                        key={service.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${selectedService === service.id ? 'ring-2 ring-primary border-primary' : ''}`}
                        onClick={() => setSelectedService(service.id)}
                      >
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm">{service.name}</p>
                            <p className="text-xs text-muted-foreground">{service.description}</p>
                            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" /> {service.estimatedArrival}
                            </div>
                          </div>
                          <p className="font-bold text-primary whitespace-nowrap">{formatRupiah(price)}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <Button
                  className="w-full mt-4 gap-2"
                  size="lg"
                  disabled={!selectedService}
                  onClick={handleBook}
                >
                  Pesan Sekarang <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </div>
        </div>

        <datalist id="city-list">
          {cities.map((c) => <option key={c} value={c} />)}
        </datalist>
      </div>
    </Layout>
  );
}
