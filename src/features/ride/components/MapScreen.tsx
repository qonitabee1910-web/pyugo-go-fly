/**
 * MapScreen Component
 * Main map display with current location, route, and driver locations
 */

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Location, NearbyDriver } from '@/lib/types/rides';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';

// Fix Leaflet marker icons
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapScreenProps {
  currentLocation: Location | null;
  pickupLocation: Location | null;
  dropoffLocation: Location | null;
  nearbyDrivers?: NearbyDriver[];
  onPickupSelect?: () => void;
  onDropoffSelect?: () => void;
  onLocationConfirm?: () => void;
  showDropoff?: boolean;
  showDrivers?: boolean;
  loading?: boolean;
}

const customPickupIcon = L.icon({
  iconUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2310b981"%3E%3Ccircle cx="12" cy="12" r="10" fill="%2310b981"/%3E%3C/svg%3E',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const customDropoffIcon = L.icon({
  iconUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ef4444"%3E%3Ccircle cx="12" cy="12" r="10" fill="%23ef4444"/%3E%3C/svg%3E',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const customDriverIcon = L.icon({
  iconUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%233b82f6"%3E%3Crect x="4" y="5" width="16" height="14" rx="2" fill="%233b82f6"/%3E%3C/svg%3E',
  iconSize: [25, 25],
  iconAnchor: [12, 12],
});

export function MapScreen({
  currentLocation,
  pickupLocation,
  dropoffLocation,
  nearbyDrivers = [],
  onPickupSelect,
  onDropoffSelect,
  onLocationConfirm,
  showDropoff = true,
  showDrivers = false,
  loading = false,
}: MapScreenProps) {
  const mapCenter = currentLocation
    ? [currentLocation.latitude, currentLocation.longitude]
    : [-6.2088, 106.6753]; // Default to Jakarta

  const bounds = [];
  if (pickupLocation) bounds.push([pickupLocation.latitude, pickupLocation.longitude]);
  if (dropoffLocation) bounds.push([dropoffLocation.latitude, dropoffLocation.longitude]);
  if (currentLocation && bounds.length === 0) bounds.push([currentLocation.latitude, currentLocation.longitude]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Map */}
      <div className="flex-1 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        <MapContainer center={mapCenter as [number, number]} zoom={15} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {/* Current Location */}
          {currentLocation && (
            <Marker position={[currentLocation.latitude, currentLocation.longitude]}>
              <Popup>Current Location</Popup>
            </Marker>
          )}

          {/* Pickup Location */}
          {pickupLocation && (
            <>
              <Marker
                position={[pickupLocation.latitude, pickupLocation.longitude]}
                icon={customPickupIcon}
                eventHandlers={{ click: onPickupSelect }}
              >
                <Popup>{pickupLocation.address}</Popup>
              </Marker>
              <Circle
                center={[pickupLocation.latitude, pickupLocation.longitude]}
                radius={100}
                fillColor="#10b981"
                fillOpacity={0.1}
              />
            </>
          )}

          {/* Dropoff Location */}
          {dropoffLocation && showDropoff && (
            <>
              <Marker
                position={[dropoffLocation.latitude, dropoffLocation.longitude]}
                icon={customDropoffIcon}
                eventHandlers={{ click: onDropoffSelect }}
              >
                <Popup>{dropoffLocation.address}</Popup>
              </Marker>
              <Circle
                center={[dropoffLocation.latitude, dropoffLocation.longitude]}
                radius={100}
                fillColor="#ef4444"
                fillOpacity={0.1}
              />
            </>
          )}

          {/* Route Polyline */}
          {pickupLocation && dropoffLocation && (
            <Polyline
              positions={[
                [pickupLocation.latitude, pickupLocation.longitude],
                [dropoffLocation.latitude, dropoffLocation.longitude],
              ]}
              color="#3b82f6"
              weight={3}
              opacity={0.7}
            />
          )}

          {/* Nearby Drivers */}
          {showDrivers &&
            nearbyDrivers.map((driver) => (
              <Marker key={driver.user_id} position={[driver.current_lat, driver.current_lng]} icon={customDriverIcon}>
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold">{driver.name}</p>
                    <p>⭐ {driver.rating}</p>
                    <p>{Math.round(driver.distance_meters / 1000)}km away</p>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>

      {/* Controls Footer */}
      <div className="p-4 bg-white border-t border-gray-200 space-y-3">
        {onLocationConfirm && (
          <Button
            onClick={onLocationConfirm}
            disabled={loading || !pickupLocation || (showDropoff && !dropoffLocation)}
            className="w-full"
            size="lg"
          >
            {loading ? 'Loading...' : 'Confirm Locations'}
          </Button>
        )}

        {!onLocationConfirm && (
          <div className="flex gap-2">
            {pickupLocation && (
              <div className="flex-1 text-sm bg-green-50 p-2 rounded border border-green-200">
                <p className="text-xs text-gray-500">Pickup</p>
                <p className="font-medium truncate">{pickupLocation.address}</p>
              </div>
            )}
            {dropoffLocation && showDropoff && (
              <div className="flex-1 text-sm bg-red-50 p-2 rounded border border-red-200">
                <p className="text-xs text-gray-500">Dropoff</p>
                <p className="font-medium truncate">{dropoffLocation.address}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
