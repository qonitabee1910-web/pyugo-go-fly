/**
 * Driver Dispatch Service
 * Integrates with Supabase Edge Function for driver matching
 */

import { supabase } from '@/shared/integrations/supabase/client';

export interface DispatchRequest {
  ride_id: string;
  pickup_lat: number;
  pickup_lng: number;
  vehicle_type?: 'motorcycle' | 'car' | 'auto';
}

export interface DispatchResponse {
  success: boolean;
  driver_id?: string;
  ride_id: string;
  error?: string;
  error_code?: string;
}

export interface DispatchStats {
  total_offers: number;
  accepted_count: number;
  rejected_count: number;
  expired_count: number;
  avg_response_time_ms: number;
  time_to_assignment_sec: number;
}

/**
 * Call the dispatch-driver Edge Function to match a ride to a driver
 * 
 * The function will:
 * 1. Fetch nearby drivers (within 5km)
 * 2. Sort by distance, rating, idle time
 * 3. Send offers sequentially with 10s timeout per driver
 * 4. Assign the first driver that accepts
 * 5. Update ride status
 * 
 * @param request - Dispatch request with ride_id and pickup coordinates
 * @returns Promise with dispatch result or error
 * @throws Error if edge function fails
 */
export async function dispatchDriver(request: DispatchRequest): Promise<DispatchResponse> {
  try {
    // Call Edge Function via Supabase
    const { data, error } = await supabase.functions.invoke('dispatch-driver', {
      body: request,
    });

    if (error) {
      console.error('Dispatch error:', error);
      throw error;
    }

    return data as DispatchResponse;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    console.error('Failed to dispatch driver:', errorMsg);

    return {
      success: false,
      ride_id: request.ride_id,
      error: errorMsg,
      error_code: 'DISPATCH_FAILED',
    };
  }
}

/**
 * Get dispatch statistics for a ride
 * Shows how the dispatch process went (how many offers, acceptance rate, etc)
 * 
 * @param ride_id - The ride ID
 * @returns Dispatch statistics
 */
export async function getDispatchStats(ride_id: string): Promise<DispatchStats | null> {
  const { data, error } = await (supabase.rpc as any)('get_dispatch_stats', {
    p_ride_id: ride_id,
  });

  if (error) {
    console.error('Error fetching dispatch stats:', error);
    return null;
  }

  return data?.[0] as DispatchStats;
}

/**
 * Get drivers currently online within a radius
 * Useful for showing available drivers on the map
 * 
 * @param latitude - Pickup latitude
 * @param longitude - Pickup longitude
 * @param radiusMeters - Search radius in meters (default 5000)
 * @param limit - Max drivers to return (default 10)
 * @returns List of nearby drivers
 */
export async function getNearbyDrivers(
  latitude: number,
  longitude: number,
  radiusMeters: number = 5000,
  limit: number = 10
) {
  const { data, error } = await (supabase.rpc as any)('get_nearby_drivers', {
    p_latitude: latitude,
    p_longitude: longitude,
    p_radius_meters: radiusMeters,
    p_limit: limit,
  });

  if (error) {
    console.error('Error fetching nearby drivers:', error);
    return [];
  }

  return data || [];
}

/**
 * Get drivers in a rectangular bounding box area
 * Faster alternative to radius search for large areas
 * 
 * @param minLat - Minimum latitude
 * @param minLng - Minimum longitude
 * @param maxLat - Maximum latitude
 * @param maxLng - Maximum longitude
 * @param limit - Max drivers to return (default 20)
 * @returns List of drivers in the bbox
 */
export async function getDriversInBbox(
  minLat: number,
  minLng: number,
  maxLat: number,
  maxLng: number,
  limit: number = 20
) {
  const { data, error } = await (supabase.rpc as any)('get_drivers_in_bbox', {
    p_min_lat: minLat,
    p_min_lng: minLng,
    p_max_lat: maxLat,
    p_max_lng: maxLng,
    p_limit: limit,
  });

  if (error) {
    console.error('Error fetching drivers in bbox:', error);
    return [];
  }

  return data || [];
}

/**
 * Update driver location (called from driver app)
 * Stores location and updates geospatial index
 * 
 * @param driver_id - Driver ID
 * @param latitude - Current latitude
 * @param longitude - Current longitude
 * @param heading - Direction (0-359 degrees, optional)
 * @param speed - Speed in km/h (optional)
 * @param accuracy - GPS accuracy in meters (optional)
 */
export async function updateDriverLocation(
  driver_id: string,
  latitude: number,
  longitude: number,
  heading?: number,
  speed?: number,
  accuracy?: number
) {
  const { error } = await (supabase.from as any)('driver_locations').upsert(
    {
      driver_id,
      latitude,
      longitude,
      heading,
      speed,
      accuracy,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'driver_id' }
  );

  if (error) {
    console.error('Error updating driver location:', error);
    throw error;
  }
}

/**
 * Update driver status (online, offline, busy)
 * 
 * @param driver_id - Driver ID
 * @param status - 'offline' | 'online' | 'busy'
 */
export async function updateDriverStatus(
  driver_id: string,
  status: 'offline' | 'online' | 'busy'
) {
  const { error } = await (supabase.from as any)('drivers').update({
    status,
    updated_at: new Date().toISOString(),
  }).eq('id', driver_id);

  if (error) {
    console.error('Error updating driver status:', error);
    throw error;
  }
}

/**
 * Respond to a driver offer (accept or reject)
 * 
 * @param offer_id - The driver offer ID
 * @param accepted - true to accept, false to reject
 */
export async function respondToOffer(offer_id: string, accepted: boolean) {
  const { error } = await (supabase.from as any)('driver_offers').update({
    status: accepted ? 'accepted' : 'rejected',
    responded_at: new Date().toISOString(),
    response_time_ms: Date.now(), // In production, calculate actual response time
  }).eq('id', offer_id);

  if (error) {
    console.error('Error responding to offer:', error);
    throw error;
  }
}

/**
 * Get active offers for a driver (for driver app)
 * 
 * @param driver_id - Driver ID
 * @returns List of pending/active offers
 */
export async function getDriverOffers(driver_id: string) {
  const { data, error } = await (supabase.from as any)('driver_offers')
    .select('*, rides(*)')
    .eq('driver_id', driver_id)
    .in('status', ['pending', 'accepted'])
    .order('offered_at', { ascending: false });

  if (error) {
    console.error('Error fetching driver offers:', error);
    return [];
  }

  return data || [];
}

/**
 * Get driver profile with current location
 * 
 * @param driver_id - Driver ID
 * @returns Driver profile with location
 */
export async function getDriverProfile(driver_id: string) {
  const { data, error } = await (supabase.from as any)('drivers')
    .select('*, driver_locations(*)')
    .eq('id', driver_id)
    .single();

  if (error) {
    console.error('Error fetching driver profile:', error);
    return null;
  }

  return data;
}

/**
 * Calculate distance between two points using Haversine formula
 * 
 * @param lat1 - First point latitude
 * @param lng1 - First point longitude
 * @param lat2 - Second point latitude
 * @param lng2 - Second point longitude
 * @returns Distance in kilometers
 */
export async function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): Promise<number> {
  const { data, error } = await (supabase.rpc as any)('haversine_distance', {
    p_lat1: lat1,
    p_lng1: lng1,
    p_lat2: lat2,
    p_lng2: lng2,
  });

  if (error) {
    console.error('Error calculating distance:', error);
    return 0;
  }

  return data;
}
