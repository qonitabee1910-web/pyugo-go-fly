/**
 * LocationPickerScreen Component
 * Select and confirm pickup and dropoff locations
 */

import { useState, useEffect } from 'react';
import { Location } from '@/lib/types/rides';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Card } from '@/shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { MapPin, X, Map } from 'lucide-react';
import { DEMO_LOCATIONS } from '@/lib/types/rides';
import { ComponentStyles, PATTERNS } from '@/design-system';

interface LocationPickerScreenProps {
  title: string;
  currentLocation?: Location;
  onSelect: (location: Location) => void;
  onBack: () => void;
  selectedLocation?: Location | null;
}

export function LocationPickerScreen({
  title,
  currentLocation,
  onSelect,
  onBack,
  selectedLocation,
}: LocationPickerScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredLocations(DEMO_LOCATIONS.popular);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = DEMO_LOCATIONS.popular.filter((loc) => loc.address.toLowerCase().includes(query));
      setFilteredLocations(filtered);
    }
  }, [searchQuery]);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b border-gray-200 ${PATTERNS.stickyHeader}`}>
        <h2 className={ComponentStyles.typography.h3}>{title}</h2>
        <button onClick={onBack} className={`p-2 hover:bg-gray-100 rounded-full transition ${ComponentStyles.button.ghost}`}>
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="relative">
          <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Cari lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 p-1 hover:bg-gray-200 rounded transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="nearby" className="flex-1 overflow-hidden flex flex-col">
        <TabsList className="rounded-none border-b w-full justify-start px-4 py-0 bg-white">
          <TabsTrigger value="nearby" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-4">
            <span className={ComponentStyles.typography.body}>📍 Terdekat</span>
          </TabsTrigger>
          <TabsTrigger value="favorites" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 px-4">
            <span className={ComponentStyles.typography.body}>⭐ Favorit</span>
          </TabsTrigger>
        </TabsList>

        {/* Nearby Locations */}
        <TabsContent value="nearby" className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full">
            <div className={PATTERNS.responsivePadding}>
              {currentLocation && (
                <LocationItem
                  location={currentLocation}
                  icon="📍"
                  subtitle="Lokasi Anda saat ini"
                  isSelected={selectedLocation?.address === currentLocation.address}
                  onClick={() => onSelect(currentLocation)}
                />
              )}

              {filteredLocations.map((location) => (
                <LocationItem
                  key={location.address}
                  location={location}
                  icon="📌"
                  isSelected={selectedLocation?.address === location.address}
                  onClick={() => onSelect(location)}
                />
              ))}

              {filteredLocations.length === 0 && searchQuery && (
                <div className="text-center py-16">
                  <Map className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className={ComponentStyles.typography.body}>Lokasi tidak ditemukan</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Favorites */}
        <TabsContent value="favorites" className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full">
            <div className={PATTERNS.responsivePadding}>
              {DEMO_LOCATIONS.popular.slice(0, 3).map((location) => (
                <LocationItem
                  key={location.address}
                  location={location}
                  icon="⭐"
                  subtitle="Disimpan"
                  isSelected={selectedLocation?.address === location.address}
                  onClick={() => onSelect(location)}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      {selectedLocation && (
        <div className="p-4 border-t border-gray-200 space-y-3">
          <div className={ComponentStyles.card.elevated}>
            <p className={ComponentStyles.typography.caption}>Lokasi terpilih</p>
            <p className={ComponentStyles.typography.body}>{selectedLocation.address}</p>
          </div>
          <button 
            onClick={() => onSelect(selectedLocation)}
            className={`${ComponentStyles.button.base} ${ComponentStyles.button.primary} ${ComponentStyles.button.lg} w-full`}
          >
            Konfirmasi Lokasi
          </button>
        </div>
      )}
    </div>
  );
}

interface LocationItemProps {
  location: Location;
  icon?: string;
  subtitle?: string;
  isSelected?: boolean;
  onClick: () => void;
}

function LocationItem({ location, icon = '📌', subtitle, isSelected, onClick }: LocationItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all mb-3 ${ 
        isSelected
          ? 'border-blue-600 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className={`${ComponentStyles.typography.body} truncate`}>{location.address}</p>
          {subtitle && <p className={`${ComponentStyles.typography.caption} text-gray-500 mt-1`}>{subtitle}</p>}
          <p className={`${ComponentStyles.typography.caption} text-gray-400 mt-1`}>
            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </p>
        </div>
        {isSelected && (
          <div className="w-6 h-6 rounded-full bg-blue-600 flex-shrink-0 mt-1 flex items-center justify-center">
            <span className="text-white text-sm font-bold">✓</span>
          </div>
        )}
      </div>
    </button>
  );
}
