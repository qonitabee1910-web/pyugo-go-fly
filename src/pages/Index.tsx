import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Hotel, Bus, Car, MapPin, CalendarDays, Users, ArrowRight, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import { cities, popularDestinations, promos, formatRupiah } from '@/data/dummy';

export default function Index() {
  const navigate = useNavigate();
  const [hotelCity, setHotelCity] = useState('');
  const [shuttleOrigin, setShuttleOrigin] = useState('');
  const [shuttleDest, setShuttleDest] = useState('');
  const [ridePickup, setRidePickup] = useState('');
  const [rideDest, setRideDest] = useState('');
  const [promoIdx, setPromoIdx] = useState(0);

  const searchHotel = () => {
    navigate(`/hotel?city=${encodeURIComponent(hotelCity)}`);
  };

  const searchShuttle = () => {
    navigate(`/shuttle?origin=${encodeURIComponent(shuttleOrigin)}&dest=${encodeURIComponent(shuttleDest)}`);
  };

  const searchRide = () => {
    navigate(`/ride?pickup=${encodeURIComponent(ridePickup)}&dest=${encodeURIComponent(rideDest)}`);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-blue-600 to-blue-800 text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-5xl font-extrabold mb-3 leading-tight">
              Pesan Tiket Mudah & Cepat
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              Hotel & Shuttle terbaik di Indonesia — harga transparan, booking instan.
            </p>
          </motion.div>

          {/* Search Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-card text-card-foreground rounded-2xl shadow-2xl p-6">
              <Tabs defaultValue="hotel">
                <TabsList className="w-full grid grid-cols-3 mb-6">
                  <TabsTrigger value="hotel" className="gap-2"><Hotel className="h-4 w-4" /> Hotel</TabsTrigger>
                  <TabsTrigger value="shuttle" className="gap-2"><Bus className="h-4 w-4" /> Shuttle</TabsTrigger>
                  <TabsTrigger value="ride" className="gap-2"><Car className="h-4 w-4" /> Ride</TabsTrigger>
                </TabsList>

                <TabsContent value="hotel">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="md:col-span-2 relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Kota tujuan"
                        className="pl-9"
                        value={hotelCity}
                        onChange={(e) => setHotelCity(e.target.value)}
                        list="city-list"
                      />
                    </div>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="date" className="pl-9" />
                    </div>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="2 Tamu, 1 Kamar" className="pl-9" />
                    </div>
                  </div>
                  <Button className="w-full mt-4 gap-2" size="lg" onClick={searchHotel}>
                    <Search className="h-4 w-4" /> Cari Hotel
                  </Button>
                </TabsContent>

                <TabsContent value="shuttle">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Kota asal"
                        className="pl-9"
                        value={shuttleOrigin}
                        onChange={(e) => setShuttleOrigin(e.target.value)}
                        list="city-list"
                      />
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Kota tujuan"
                        className="pl-9"
                        value={shuttleDest}
                        onChange={(e) => setShuttleDest(e.target.value)}
                        list="city-list"
                      />
                    </div>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="date" className="pl-9" />
                    </div>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="1 Penumpang" className="pl-9" />
                    </div>
                  </div>
                  <Button className="w-full mt-4 gap-2" size="lg" onClick={searchShuttle}>
                    <Search className="h-4 w-4" /> Cari Shuttle
                  </Button>
                </TabsContent>

                <TabsContent value="ride">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Lokasi jemput"
                        className="pl-9"
                        value={ridePickup}
                        onChange={(e) => setRidePickup(e.target.value)}
                        list="city-list"
                      />
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Lokasi tujuan"
                        className="pl-9"
                        value={rideDest}
                        onChange={(e) => setRideDest(e.target.value)}
                        list="city-list"
                      />
                    </div>
                  </div>
                  <Button className="w-full mt-4 gap-2" size="lg" onClick={searchRide}>
                    <Search className="h-4 w-4" /> Cari Ride
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </div>
        <datalist id="city-list">
          {cities.map((c) => <option key={c} value={c} />)}
        </datalist>
      </section>

      {/* Promo */}
      <section id="promo" className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Promo Spesial</h2>
        <div className="relative">
          <div className="overflow-hidden rounded-xl">
            <motion.div
              key={promoIdx}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className={`bg-gradient-to-r ${promos[promoIdx].color} text-white rounded-xl p-8 md:p-12`}
            >
              <p className="text-sm font-medium opacity-80 mb-1">Promo Terbatas</p>
              <h3 className="text-2xl md:text-3xl font-bold mb-2">{promos[promoIdx].title}</h3>
              <p className="opacity-90">{promos[promoIdx].subtitle}</p>
            </motion.div>
          </div>
          <div className="flex justify-center gap-2 mt-4">
            {promos.map((_, i) => (
              <button
                key={i}
                onClick={() => setPromoIdx(i)}
                className={`h-2 rounded-full transition-all ${i === promoIdx ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold mb-6">Destinasi Populer</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularDestinations.map((dest) => (
            <motion.div
              key={dest.city}
              whileHover={{ y: -4 }}
              className="group cursor-pointer"
              onClick={() => navigate(`/hotel?city=${encodeURIComponent(dest.city)}`)}
            >
              <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
                <img src={dest.image} alt={dest.city} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <p className="font-bold text-sm">{dest.city}</p>
                  <p className="text-xs opacity-80">{dest.hotels} hotel</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
