/**
 * useRealtimeRide Hook
 * Subscribes to real-time ride updates from Supabase
 */

import { useEffect, useCallback, useState } from 'react';
import { RideRequest, RideAssignment } from '@/lib/types/rides';
import { RideService } from '@/integrations/ride.service';

export function useRealtimeRide(rideId: string | null, onStatusChange?: (ride: RideRequest) => void) {
  const [ride, setRide] = useState<RideRequest | null>(null);
  const [assignment, setAssignment] = useState<RideAssignment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial ride data
  const fetchRide = useCallback(async () => {
    if (!rideId) return;
    try {
      setLoading(true);
      const data = await RideService.getRide(rideId);
      setRide(data);
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch ride';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [rideId]);

  // Fetch initial assignment data
  const fetchAssignment = useCallback(async () => {
    if (!rideId) return;
    try {
      const data = await RideService.getRideAssignment(rideId);
      setAssignment(data);
    } catch (err) {
      // Assignment might not exist yet, that's okay
    }
  }, [rideId]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!rideId) return;

    fetchRide();
    fetchAssignment();

    // Subscribe to ride updates
    const rideSubscription = RideService.subscribeToRide(rideId, (updatedRide) => {
      setRide(updatedRide);
      onStatusChange?.(updatedRide);
    });

    // Subscribe to assignment updates
    const assignmentSubscription = RideService.subscribeToRideAssignment(rideId, (updatedAssignment) => {
      setAssignment(updatedAssignment);
    });

    return () => {
      rideSubscription?.unsubscribe();
      assignmentSubscription?.unsubscribe();
    };
  }, [rideId, fetchRide, fetchAssignment, onStatusChange]);

  return {
    ride,
    assignment,
    loading,
    error,
  };
}
