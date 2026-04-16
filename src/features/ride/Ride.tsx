/**
 * Ride Feature - Main Component
 * Orchestrates the complete on-demand ride booking flow
 */

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { useRideState } from '@/hooks/useRideState';
import { useRealtimeRide } from '@/hooks/useRealtimeRide';
import { useNearbyDrivers } from '@/hooks/useNearbyDrivers';
import { RideService } from '@/integrations/ride.service';
import { Location, RideStatus, DEMO_LOCATIONS, Driver } from '@/lib/types/rides';

import { MapScreen } from './components/MapScreen';
import { LocationPickerScreen } from './components/LocationPickerScreen';
import { RideConfirmationScreen } from './components/RideConfirmationScreen';
import { DriverSearchingScreen } from './components/DriverSearchingScreen';
import { TripOngoingScreen } from './components/TripOngoingScreen';
import { TripCompletedScreen } from './components/TripCompletedScreen';

type Screen =
  | 'map'
  | 'location-pickup'
  | 'location-dropoff'
  | 'confirmation'
  | 'searching'
  | 'ongoing'
  | 'completed';

interface AppState {
  currentScreen: Screen;
  searchingStartTime: number;
  assignedDriver: Driver | null;
}

export function Ride() {
  const { user } = useAuth();
  const rideState = useRideState();
  const { drivers: nearbyDrivers } = useNearbyDrivers(
    rideState.state.pickupLocation?.latitude || null,
    rideState.state.pickupLocation?.longitude || null
  );

  const { ride, assignment, loading: rideLoading } = useRealtimeRide(rideState.state.rideId, (updatedRide) => {
    rideState.setRideStatus(updatedRide.status as RideStatus);

    // Auto-transition screens based on ride status
    if (updatedRide.status === 'accepted' && appState.currentScreen === 'searching') {
      setAppState((prev) => ({ ...prev, currentScreen: 'ongoing' }));
    } else if (updatedRide.status === 'completed') {
      setAppState((prev) => ({ ...prev, currentScreen: 'completed' }));
    }
  });

  const [appState, setAppState] = useState<AppState>({
    currentScreen: 'map',
    searchingStartTime: 0,
    assignedDriver: null,
  });

  // Initialize current location on mount
  useEffect(() => {
    // In production, use actual geolocation
    rideState.setCurrentLocation(DEMO_LOCATIONS.current);
    rideState.setPickupLocation(DEMO_LOCATIONS.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle screen navigation
  const goToScreen = useCallback((screen: Screen) => {
    setAppState((prev) => ({ ...prev, currentScreen: screen }));
  }, []);

  const handlePickupSelect = (location: Location) => {
    rideState.setPickupLocation(location);
    goToScreen('map');
  };

  const handleDropoffSelect = (location: Location) => {
    rideState.setDropoffLocation(location);
    goToScreen('map');
  };

  const handleLocationsConfirmed = async () => {
    try {
      rideState.setLoading(true);

      // Calculate route
      if (!rideState.state.pickupLocation || !rideState.state.dropoffLocation) {
        throw new Error('Missing location data');
      }

      const { route, fare } = await RideService.calculateRoute(
        rideState.state.pickupLocation,
        rideState.state.dropoffLocation
      );

      rideState.setRoute(route);
      rideState.setEstimatedFare(fare);
      rideState.setLoading(false);
      goToScreen('confirmation');
    } catch (error) {
      rideState.setError('Failed to calculate route');
      rideState.setLoading(false);
    }
  };

  const handleConfirmRide = async () => {
    try {
      if (!user) throw new Error('User not authenticated');

      const ride = await rideState.createRide(user.id);

      setAppState((prev) => ({
        ...prev,
        currentScreen: 'searching',
        searchingStartTime: Date.now(),
      }));

      // Simulate driver acceptance after 3-5 seconds (in production, wait for real assignment)
      setTimeout(() => {
        if (rideState.state.rideStatus === 'searching') {
          // Simulate driver acceptance
          const mockDriver = nearbyDrivers[0];
          if (mockDriver) {
            setAppState((prev) => ({
              ...prev,
              assignedDriver: {
                id: mockDriver.user_id,
                name: mockDriver.name,
                rating: mockDriver.rating,
                vehicle_type: mockDriver.vehicle_type,
                vehicle_plate: 'DL 01 AB 1234',
                vehicle_color: 'silver',
                photo_url: mockDriver.photo_url,
              },
            }));
            rideState.setRideStatus('accepted');
            goToScreen('ongoing');
          }
        }
      }, 3000 + Math.random() * 2000);
    } catch (error) {
      rideState.setError(error instanceof Error ? error.message : 'Failed to request ride');
    }
  };

  const handleCancelRide = async () => {
    try {
      await rideState.cancelRide();
      goToScreen('map');
    } catch (error) {
      rideState.setError('Failed to cancel ride');
    }
  };

  const handleCompleteTrip = () => {
    goToScreen('completed');
  };

  const handleRating = async (rating: number, comment: string) => {
    try {
      if (rideState.state.rideId) {
        await rideState.completeRide();
        // In production, save rating to database
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const handleNewRide = () => {
    rideState.reset();
    rideState.setCurrentLocation(DEMO_LOCATIONS.current);
    rideState.setPickupLocation(DEMO_LOCATIONS.current);
    setAppState({
      currentScreen: 'map',
      searchingStartTime: 0,
      assignedDriver: null,
    });
  };

  // Render current screen
  const elapsedSeconds = Math.round((Date.now() - appState.searchingStartTime) / 1000);

  return (
    <div className="w-full h-screen bg-white overflow-hidden">
      {appState.currentScreen === 'map' && (
        <MapScreen
          currentLocation={rideState.state.currentLocation}
          pickupLocation={rideState.state.pickupLocation}
          dropoffLocation={rideState.state.dropoffLocation}
          nearbyDrivers={appState.currentScreen === 'map' ? [] : nearbyDrivers}
          showDropoff={true}
          onPickupSelect={() => goToScreen('location-pickup')}
          onDropoffSelect={() => goToScreen('location-dropoff')}
          onLocationConfirm={handleLocationsConfirmed}
          loading={rideState.state.loading}
        />
      )}

      {appState.currentScreen === 'location-pickup' && rideState.state.currentLocation && (
        <LocationPickerScreen
          title="Where are you?"
          currentLocation={rideState.state.currentLocation}
          selectedLocation={rideState.state.pickupLocation}
          onSelect={handlePickupSelect}
          onBack={() => goToScreen('map')}
        />
      )}

      {appState.currentScreen === 'location-dropoff' && (
        <LocationPickerScreen
          title="Where to?"
          onSelect={handleDropoffSelect}
          onBack={() => goToScreen('map')}
          selectedLocation={rideState.state.dropoffLocation}
        />
      )}

      {appState.currentScreen === 'confirmation' &&
        rideState.state.pickupLocation &&
        rideState.state.dropoffLocation && (
          <RideConfirmationScreen
            pickupLocation={rideState.state.pickupLocation}
            dropoffLocation={rideState.state.dropoffLocation}
            route={rideState.state.route}
            estimatedFare={rideState.state.estimatedFare}
            serviceType={rideState.state.serviceType}
            onServiceTypeChange={rideState.setServiceType}
            onConfirm={handleConfirmRide}
            onCancel={() => goToScreen('map')}
            loading={rideState.state.loading}
          />
        )}

      {appState.currentScreen === 'searching' && (
        <DriverSearchingScreen
          nearbyDrivers={nearbyDrivers}
          estimatedFare={rideState.state.estimatedFare}
          onCancel={handleCancelRide}
          elapsedSeconds={elapsedSeconds}
        />
      )}

      {appState.currentScreen === 'ongoing' &&
        appState.assignedDriver &&
        rideState.state.pickupLocation &&
        rideState.state.dropoffLocation && (
          <div className="h-full flex flex-col">
            <div className="flex-1">
              <MapScreen
                currentLocation={rideState.state.currentLocation}
                pickupLocation={rideState.state.pickupLocation}
                dropoffLocation={rideState.state.dropoffLocation}
                nearbyDrivers={[]}
                showDropoff={true}
                showDrivers={true}
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              <TripOngoingScreen
                driver={appState.assignedDriver}
                pickupLocation={rideState.state.pickupLocation}
                dropoffLocation={rideState.state.dropoffLocation}
                status="started"
                eta={8}
                currentDistance={1200}
                onCall={() => console.log('Call driver')}
                onMessage={() => console.log('Message driver')}
                onShare={() => console.log('Share trip')}
              />
            </div>
            <div className="p-4 bg-white border-t">
              <button
                onClick={handleCompleteTrip}
                className="w-full px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
              >
                Complete Trip
              </button>
            </div>
          </div>
        )}

      {appState.currentScreen === 'completed' &&
        appState.assignedDriver &&
        rideState.state.pickupLocation &&
        rideState.state.dropoffLocation && (
          <TripCompletedScreen
            driver={appState.assignedDriver}
            pickupLocation={rideState.state.pickupLocation}
            dropoffLocation={rideState.state.dropoffLocation}
            distance={rideState.state.route?.distance_meters || 5000}
            duration={rideState.state.route?.duration_seconds || 600}
            estimatedFare={rideState.state.estimatedFare || 0}
            actualFare={rideState.state.estimatedFare}
            onRate={handleRating}
            onNewRide={handleNewRide}
          />
        )}
    </div>
  );
}
