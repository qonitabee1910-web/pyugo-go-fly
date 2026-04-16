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
import { MapPinIcon, X, MapIcon } from 'lucide-react';
import { DEMO_LOCATIONS } from '@/lib/types/rides';

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
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="relative">
          <MapPinIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
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
        <TabsList className="rounded-none border-b w-full justify-start px-4 py-0">
          <TabsTrigger value="nearby" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500">
            Nearby
          </TabsTrigger>
          <TabsTrigger
            value="favorites"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
          >
            Favorites
          </TabsTrigger>
        </TabsList>

        {/* Nearby Locations */}
        <TabsContent value="nearby" className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              {currentLocation && (
                <LocationItem
                  location={currentLocation}
                  icon="📍"
                  subtitle="Your current location"
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
                <div className="text-center py-8 text-gray-500">
                  <MapIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No locations found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Favorites */}
        <TabsContent value="favorites" className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              {DEMO_LOCATIONS.popular.slice(0, 3).map((location) => (
                <LocationItem
                  key={location.address}
                  location={location}
                  icon="⭐"
                  subtitle="Saved"
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
          <Card className="p-3 bg-blue-50 border-blue-200">
            <p className="text-xs text-gray-600">Selected location</p>
            <p className="font-medium text-sm">{selectedLocation.address}</p>
          </Card>
          <Button onClick={() => onSelect(selectedLocation)} className="w-full" size="lg">
            Confirm Location
          </Button>
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
      className={`w-full text-left p-3 rounded-lg border-2 transition-all ${ 
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl mt-1">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-gray-900 truncate">{location.address}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          <p className="text-xs text-gray-400 mt-1">
            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </p>
        </div>
        {isSelected && <div className="w-5 h-5 rounded-full bg-blue-500 flex-shrink-0 mt-2" />}
      </div>
    </button>
  );
}
