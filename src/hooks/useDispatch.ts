/**
 * useDispatch Hook
 * React hook for managing ride dispatch workflow
 */

import { useState, useCallback } from 'react';
import { Ride, Fare, Dispatch, DispatchStatus } from '@/lib/types/ride';
import { 
  calculateRideFare, 
  FareCalculationInput, 
  FareCalculationResult,
  validateFareInput 
} from '@/lib/engines/fareCalculation';
import {
  findAvailableDrivers,
  sendDispatchOffer,
  DispatchRequest,
  validateDispatchRequest,
} from '@/lib/engines/driverDispatch';

export interface UseDispatchState {
  ride: Ride | null;
  fare: FareCalculationResult | null;
  dispatch: Dispatch | null;
  loading: boolean;
  error: string | null;
}

export interface UseDispatchActions {
  calculateFare: (input: FareCalculationInput) => void;
  requestRide: (pickupLat: number, pickupLon: number, dropoffLat: number, dropoffLon: number) => void;
  dispatchDrivers: (serviceType: 'motor' | 'women' | 'car') => void;
  acceptDriver: (driverId: string) => void;
  cancelRide: () => void;
  reset: () => void;
}

const initialState: UseDispatchState = {
  ride: null,
  fare: null,
  dispatch: null,
  loading: false,
  error: null,
};

export function useDispatch(): UseDispatchState & UseDispatchActions {
  const [state, setState] = useState<UseDispatchState>(initialState);

  const calculateFare = useCallback((input: FareCalculationInput) => {
    // Validate input
    const validation = validateFareInput(input);
    if (!validation.valid) {
      setState(prev => ({ ...prev, error: validation.error || 'Invalid fare input' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = calculateRideFare(input);
      setState(prev => ({
        ...prev,
        fare: result,
        loading: false,
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Fare calculation failed',
        loading: false,
      }));
    }
  }, []);

  const requestRide = useCallback((
    pickupLat: number,
    pickupLon: number,
    dropoffLat: number,
    dropoffLon: number
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const newRide: Ride = {
        id: `ride_${Date.now()}`,
        userId: 'user_001', // Would come from auth context
        pickupLocation: {
          name: 'Pickup Location',
          latitude: pickupLat,
          longitude: pickupLon,
        },
        dropoffLocation: {
          name: 'Dropoff Location',
          latitude: dropoffLat,
          longitude: dropoffLon,
        },
        serviceId: 'rs1', // Default to motorcycle
        status: 'searching',
        requestedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setState(prev => ({
        ...prev,
        ride: newRide,
        loading: false,
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to request ride',
        loading: false,
      }));
    }
  }, []);

  const dispatchDrivers = useCallback((serviceType: 'motor' | 'women' | 'car') => {
    if (!state.ride) {
      setState(prev => ({
        ...prev,
        error: 'No active ride to dispatch',
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const dispatchRequest: DispatchRequest = {
        pickupLocation: state.ride.pickupLocation,
        serviceType,
        minRating: 4.0,
        maxRadius: 5,
      };

      // Validate request
      const validation = validateDispatchRequest(dispatchRequest);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // Find drivers
      const result = findAvailableDrivers(dispatchRequest);

      if (!result.selectedDriver) {
        setState(prev => ({
          ...prev,
          error: 'No drivers available in your area',
          loading: false,
        }));
        return;
      }

      // Send offer (async)
      sendDispatchOffer(result.selectedDriver.driverId, state.ride.id)
        .then(accepted => {
          if (accepted) {
            const dispatch: Dispatch = {
              id: `dispatch_${Date.now()}`,
              rideId: state.ride!.id,
              driverId: result.selectedDriver!.driverId,
              offerStatus: 'accepted',
              offeredAt: new Date(),
              acceptedAt: new Date(),
              expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min expiry
            };

            setState(prev => ({
              ...prev,
              dispatch,
              ride: prev.ride ? { ...prev.ride, status: 'matched', driverId: result.selectedDriver!.driverId } : null,
              loading: false,
            }));
          } else {
            setState(prev => ({
              ...prev,
              error: 'Driver rejected the ride offer',
              loading: false,
            }));
          }
        })
        .catch(err => {
          setState(prev => ({
            ...prev,
            error: 'Failed to connect with driver',
            loading: false,
          }));
        });
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Dispatch failed',
        loading: false,
      }));
    }
  }, [state.ride]);

  const acceptDriver = useCallback((driverId: string) => {
    if (!state.ride) {
      setState(prev => ({
        ...prev,
        error: 'No active ride',
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      ride: prev.ride ? { ...prev.ride, driverId, status: 'accepted' } : null,
    }));
  }, [state.ride]);

  const cancelRide = useCallback(() => {
    setState(prev => ({
      ...prev,
      ride: prev.ride ? { ...prev.ride, status: 'cancelled' } : null,
      dispatch: null,
      error: null,
    }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    calculateFare,
    requestRide,
    dispatchDrivers,
    acceptDriver,
    cancelRide,
    reset,
  };
}
