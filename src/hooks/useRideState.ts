/**
 * useRideState Hook
 * Manages ride booking state and operations
 */

import { useState, useCallback } from 'react';
import { Location, RideRequest, Route, RideStatus } from '@/lib/types/rides';
import { RideService } from '@/integrations/ride.service';

export interface RideState {
  // Locations
  currentLocation: Location | null;
  pickupLocation: Location | null;
  dropoffLocation: Location | null;

  // Route & Fare
  route: Route | null;
  estimatedFare: number | null;

  // Ride details
  rideId: string | null;
  rideStatus: RideStatus;
  serviceType: 'motorcycle' | 'car' | 'auto';

  // UI state
  loading: boolean;
  error: string | null;
}

const initialState: RideState = {
  currentLocation: null,
  pickupLocation: null,
  dropoffLocation: null,
  route: null,
  estimatedFare: null,
  rideId: null,
  rideStatus: 'idle',
  serviceType: 'motorcycle',
  loading: false,
  error: null,
};

export function useRideState() {
  const [state, setState] = useState<RideState>(initialState);

  const setCurrentLocation = useCallback((location: Location) => {
    setState((prev) => ({ ...prev, currentLocation: location }));
  }, []);

  const setPickupLocation = useCallback((location: Location) => {
    setState((prev) => ({ ...prev, pickupLocation: location }));
  }, []);

  const setDropoffLocation = useCallback((location: Location) => {
    setState((prev) => ({ ...prev, dropoffLocation: location }));
  }, []);

  const setRoute = useCallback((route: Route | null) => {
    setState((prev) => ({ ...prev, route }));
  }, []);

  const setEstimatedFare = useCallback((fare: number) => {
    setState((prev) => ({ ...prev, estimatedFare: fare }));
  }, []);

  const setServiceType = useCallback((type: 'motorcycle' | 'car' | 'auto') => {
    setState((prev) => ({ ...prev, serviceType: type }));
  }, []);

  const setRideStatus = useCallback((status: RideStatus) => {
    setState((prev) => ({ ...prev, rideStatus: status }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  const createRide = useCallback(
    async (userId: string) => {
      try {
        setLoading(true);
        setError(null);

        if (!state.pickupLocation || !state.dropoffLocation || !state.route || state.estimatedFare === null) {
          throw new Error('Missing required information');
        }

        const ride = await RideService.createRide(
          userId,
          state.pickupLocation,
          state.dropoffLocation,
          state.route,
          state.serviceType,
          state.estimatedFare
        );

        setState((prev) => ({
          ...prev,
          rideId: ride.id,
          rideStatus: 'searching',
          loading: false,
        }));

        return ride;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to create ride';
        setError(errorMsg);
        setLoading(false);
        throw err;
      }
    },
    [state.pickupLocation, state.dropoffLocation, state.route, state.estimatedFare, state.serviceType]
  );

  const cancelRide = useCallback(async () => {
    if (!state.rideId) return;

    try {
      setLoading(true);
      await RideService.cancelRide(state.rideId);
      setState(initialState);
      setLoading(false);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to cancel ride';
      setError(errorMsg);
      setLoading(false);
    }
  }, [state.rideId]);

  const completeRide = useCallback(
    async (actualFare?: number) => {
      if (!state.rideId) return;

      try {
        setLoading(true);
        await RideService.completeRide(state.rideId, actualFare);
        setState(initialState);
        setLoading(false);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to complete ride';
        setError(errorMsg);
        setLoading(false);
      }
    },
    [state.rideId]
  );

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    state,
    setCurrentLocation,
    setPickupLocation,
    setDropoffLocation,
    setRoute,
    setEstimatedFare,
    setServiceType,
    setRideStatus,
    setLoading,
    setError,
    createRide,
    cancelRide,
    completeRide,
    reset,
  };
}
