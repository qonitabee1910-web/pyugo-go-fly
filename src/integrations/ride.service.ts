/**
 * Rides API Service
 * Handles all ride-related operations with Supabase
 */

import { supabase } from '@/shared/integrations/supabase/client';
import { RideRequest, Location, Route, RideStatus, NearbyDriver, DUMMY_DRIVERS, RideAssignment } from '@/lib/types/rides';

export class RideService {
  /**
   * Create a new ride request
   */
  static async createRide(
    userId: string,
    pickup: Location,
    dropoff: Location,
    route: Route,
    serviceType: 'motorcycle' | 'car' | 'auto',
    estimatedFare: number
  ): Promise<RideRequest> {
    const { data, error } = await supabase
      .from('rides')
      .insert({
        user_id: userId,
        pickup_location: pickup,
        dropoff_location: dropoff,
        route,
        status: 'searching',
        service_type: serviceType,
        estimated_fare: estimatedFare,
      })
      .select()
      .single();

    if (error) throw error;
    return data as RideRequest;
  }

  /**
   * Get ride by ID
   */
  static async getRide(rideId: string): Promise<RideRequest | null> {
    const { data, error } = await supabase
      .from('rides')
      .select('*')
      .eq('id', rideId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return (data as RideRequest) || null;
  }

  /**
   * Get user's rides with optional status filter
   */
  static async getUserRides(userId: string, status?: RideStatus): Promise<RideRequest[]> {
    let query = supabase.from('rides').select('*').eq('user_id', userId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return (data as RideRequest[]) || [];
  }

  /**
   * Update ride status
   */
  static async updateRideStatus(rideId: string, status: RideStatus): Promise<RideRequest> {
    const { data, error } = await supabase
      .from('rides')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', rideId)
      .select()
      .single();

    if (error) throw error;
    return data as RideRequest;
  }

  /**
   * Cancel a ride
   */
  static async cancelRide(rideId: string): Promise<void> {
    const { error } = await supabase
      .from('rides')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', rideId);

    if (error) throw error;
  }

  /**
   * Complete a ride (with actual fare and completion time)
   */
  static async completeRide(rideId: string, actualFare?: number): Promise<RideRequest> {
    const { data, error } = await supabase
      .from('rides')
      .update({
        status: 'completed',
        actual_fare: actualFare,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', rideId)
      .select()
      .single();

    if (error) throw error;
    return data as RideRequest;
  }

  /**
   * Get ride assignment details
   */
  static async getRideAssignment(rideId: string): Promise<RideAssignment | null> {
    const { data, error } = await supabase
      .from('ride_assignments')
      .select('*')
      .eq('ride_id', rideId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return (data as RideAssignment) || null;
  }

  /**
   * Create ride assignment (for drivers accepting rides)
   */
  static async createRideAssignment(rideId: string, driverId: string): Promise<RideAssignment> {
    const { data, error } = await supabase
      .from('ride_assignments')
      .insert({
        ride_id: rideId,
        driver_id: driverId,
        status: 'accepted',
      })
      .select()
      .single();

    if (error) throw error;
    return data as RideAssignment;
  }

  /**
   * Update ride assignment status
   */
  static async updateRideAssignmentStatus(rideId: string, status: string): Promise<void> {
    const { error } = await supabase
      .from('ride_assignments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('ride_id', rideId);

    if (error) throw error;
  }

  /**
   * Subscribe to ride updates (real-time)
   */
  static subscribeToRide(rideId: string, callback: (ride: RideRequest) => void) {
    const subscription = supabase
      .channel(`ride:${rideId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rides',
          filter: `id=eq.${rideId}`,
        },
        (payload) => {
          callback(payload.new as RideRequest);
        }
      )
      .subscribe();

    return subscription;
  }

  /**
   * Subscribe to ride assignment updates
   */
  static subscribeToRideAssignment(rideId: string, callback: (assignment: RideAssignment) => void) {
    const subscription = supabase
      .channel(`assignment:${rideId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ride_assignments',
          filter: `ride_id=eq.${rideId}`,
        },
        (payload) => {
          callback(payload.new as RideAssignment);
        }
      )
      .subscribe();

    return subscription;
  }

  /**
   * Get nearby drivers (mock data for now)
   * In production: would fetch from drivers table with geospatial queries
   */
  static async getNearbyDrivers(
    pickupLat: number,
    pickupLng: number,
    radiusMeters: number = 5000
  ): Promise<NearbyDriver[]> {
    // For now, return mock drivers with simulated distances
    // In production, use PostGIS for geospatial queries
    return DUMMY_DRIVERS.map((driver) => ({
      ...driver,
      distance_meters: Math.random() * radiusMeters,
    }));
  }

  /**
   * Calculate route and fare (mock)
   * In production: use Google Maps API or similar
   */
  static async calculateRoute(pickup: Location, dropoff: Location): Promise<{ route: Route; fare: number }> {
    // Mock calculation
    const distanceMeters = Math.random() * 10000 + 500;
    const durationSeconds = (distanceMeters / 40) * 3.6; // Assume ~40 km/h average

    // Fare calculation: base + per-km + per-minute
    const baseFare = 10000; // IDR
    const perKmFare = 2500;
    const perMinuteFare = 500;
    const fare = baseFare + (distanceMeters / 1000) * perKmFare + (durationSeconds / 60) * perMinuteFare;

    return {
      route: {
        distance_meters: distanceMeters,
        duration_seconds: Math.round(durationSeconds),
      },
      fare: Math.round(fare),
    };
  }

  /**
   * Dispatch driver to ride using Supabase Edge Function
   * 
   * Calls the dispatch-driver Edge Function which:
   * 1. Finds nearby drivers within 5km
   * 2. Sorts by distance, rating, idle time
   * 3. Sends offers sequentially with 10s timeout
   * 4. Assigns first driver that accepts
   * 
   * @param rideId - Ride ID to dispatch
   * @param pickupLat - Pickup latitude
   * @param pickupLng - Pickup longitude
   * @returns Driver ID if successful, throws error otherwise
   */
  static async dispatchDriver(
    rideId: string,
    pickupLat: number,
    pickupLng: number
  ): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('dispatch-driver', {
        body: {
          ride_id: rideId,
          pickup_lat: pickupLat,
          pickup_lng: pickupLng,
        },
      });

      if (error || !data?.success) {
        const errorMsg = data?.error || error?.message || 'Unknown dispatch error';
        throw new Error(`Driver dispatch failed: ${errorMsg}`);
      }

      return data.driver_id;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to dispatch driver';
      console.error('Dispatch error:', errorMsg);
      throw err;
    }
  }
}
