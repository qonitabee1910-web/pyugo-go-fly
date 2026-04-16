/**
 * useNearbyDrivers Hook
 * Fetches and manages nearby drivers
 */

import { useEffect, useState, useCallback } from 'react';
import { NearbyDriver } from '@/lib/types/rides';
import { RideService } from '@/integrations/ride.service';

export function useNearbyDrivers(latitude: number | null, longitude: number | null, radiusMeters: number = 5000) {
  const [drivers, setDrivers] = useState<NearbyDriver[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDrivers = useCallback(async () => {
    if (!latitude || !longitude) return;

    try {
      setLoading(true);
      const nearbyDrivers = await RideService.getNearbyDrivers(latitude, longitude, radiusMeters);
      // Sort by distance
      setDrivers(
        nearbyDrivers.sort((a, b) => a.distance_meters - b.distance_meters)
      );
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch nearby drivers';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [latitude, longitude, radiusMeters]);

  useEffect(() => {
    fetchDrivers();

    // Refresh drivers every 10 seconds (simulate real-time updates)
    const interval = setInterval(fetchDrivers, 10000);

    return () => clearInterval(interval);
  }, [fetchDrivers]);

  return {
    drivers,
    loading,
    error,
    refetch: fetchDrivers,
  };
}
