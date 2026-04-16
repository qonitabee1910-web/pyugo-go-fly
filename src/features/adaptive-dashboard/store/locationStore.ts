/**
 * Location data types for adaptive dashboard
 * Use component state or Context API instead of Zustand
 */

export interface Location {
  lat: number;
  lng: number;
  address: string;
  label?: string;
}

export interface SavedLocation extends Location {
  id: string;
  name: string;
  type: 'home' | 'work' | 'favorite' | 'other';
}

export const mockCurrentLocation: Location = {
  lat: -6.2088,
  lng: 106.8456,
  address: 'Jl. Sudirman, Jakarta Selatan',
  label: 'Lokasi Saat Ini',
};

export const mockSavedLocations: SavedLocation[] = [
  {
    id: '1',
    name: 'Rumah',
    lat: -6.1256,
    lng: 106.7313,
    address: 'Jl. Gatot Subroto, Jakarta',
    type: 'home',
  },
  {
    id: '2',
    name: 'Kantor',
    lat: -6.2275,
    lng: 106.8254,
    address: 'Gedung Bursa Efek Indonesia',
    type: 'work',
  },
];
