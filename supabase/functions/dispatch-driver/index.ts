/**
 * Driver Dispatch Edge Function
 * 
 * Matches rides to drivers using PostGIS geospatial queries and intelligent ranking.
 * 
 * POST /dispatch
 * Body: { ride_id: string, pickup_lat: number, pickup_lng: number }
 * 
 * Returns: { driver_id: string, ride_id: string } or error
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Constants
const SEARCH_RADIUS_METERS = 5000;
const DRIVER_REQUEST_TIMEOUT_MS = 10000;
const MAX_RETRIES = 10; // Try up to 10 drivers

// Types
interface DispatchRequest {
  ride_id: string;
  pickup_lat: number;
  pickup_lng: number;
}

interface Driver {
  driver_id: string;
  user_id: string;
  name: string;
  latitude: number;
  longitude: number;
  rating: number;
  distance_meters: number;
  idle_minutes: number;
  acceptance_probability: number;
}

interface DispatchResponse {
  success: boolean;
  driver_id?: string;
  ride_id: string;
  error?: string;
  error_code?: string;
}

/**
 * Main dispatch handler
 */
Deno.serve(async (req) => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body: DispatchRequest = await req.json();

    // Validate input
    if (!body.ride_id || body.pickup_lat === undefined || body.pickup_lng === undefined) {
      return corsResponse({
        success: false,
        ride_id: body.ride_id || 'unknown',
        error: 'Missing required fields: ride_id, pickup_lat, pickup_lng',
        error_code: 'INVALID_INPUT',
      }, 400);
    }

    // Fetch and rank available drivers
    const drivers = await fetchNearbyDrivers(body.pickup_lat, body.pickup_lng);

    if (drivers.length === 0) {
      // No drivers available - update ride status
      await updateRideStatus(body.ride_id, 'no_drivers_available');
      return corsResponse({
        success: false,
        ride_id: body.ride_id,
        error: 'No drivers available in your area',
        error_code: 'NO_DRIVERS',
      }, 404);
    }

    // Try to dispatch to drivers sequentially
    const assignedDriver = await dispatchToDrivers(body.ride_id, drivers);

    if (!assignedDriver) {
      // All drivers rejected or timed out
      await updateRideStatus(body.ride_id, 'no_drivers_accepted');
      return corsResponse({
        success: false,
        ride_id: body.ride_id,
        error: 'No drivers accepted the ride',
        error_code: 'NO_ACCEPTANCE',
      }, 404);
    }

    // Assignment successful - update ride status
    await supabase
      .from('ride_assignments')
      .insert({
        ride_id: body.ride_id,
        driver_id: assignedDriver.driver_id,
        status: 'accepted',
      });

    await updateRideStatus(body.ride_id, 'accepted');

    return corsResponse({
      success: true,
      driver_id: assignedDriver.driver_id,
      ride_id: body.ride_id,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Dispatch error:', errorMsg, error);

    return corsResponse(
      {
        success: false,
        ride_id: 'unknown',
        error: 'Internal server error',
        error_code: 'SERVER_ERROR',
      },
      500
    );
  }
});

/**
 * Fetch available drivers within search radius, sorted by distance, rating, and idle time
 * Uses PostGIS for geospatial queries
 */
async function fetchNearbyDrivers(
  pickup_lat: number,
  pickup_lng: number
): Promise<Driver[]> {
  const { data, error } = await supabase.rpc('get_nearby_drivers', {
    p_latitude: pickup_lat,
    p_longitude: pickup_lng,
    p_radius_meters: SEARCH_RADIUS_METERS,
    p_limit: MAX_RETRIES,
  }) as any;

  if (error) {
    console.error('Error fetching nearby drivers:', error);
    throw new Error(`Failed to fetch drivers: ${error.message}`);
  }

  return (data || []) as Driver[];
}

/**
 * Send ride offers to drivers sequentially with timeout
 * Assign first driver that accepts within timeout window
 */
async function dispatchToDrivers(ride_id: string, drivers: Driver[]): Promise<Driver | null> {
  for (let i = 0; i < drivers.length; i++) {
    const driver = drivers[i];

    try {
      console.log(`[${i + 1}/${drivers.length}] Offering ride to ${driver.name} (${driver.driver_id})`);

      // Send offer to driver (in real system, would be Firebase/Twilio/etc)
      const accepted = await offerRideToDriver(ride_id, driver, DRIVER_REQUEST_TIMEOUT_MS);

      if (accepted) {
        console.log(`✓ Driver ${driver.name} accepted ride`);
        return driver;
      } else {
        console.log(`✗ Driver ${driver.name} rejected or timed out`);
      }
    } catch (err) {
      console.error(`Error offering ride to ${driver.name}:`, err);
      // Continue to next driver on error
    }
  }

  return null; // No driver accepted
}

/**
 * Offer ride to driver and wait for response within timeout
 * In production, this would integrate with:
 * - Firebase Cloud Messaging
 * - Twilio SMS
 * - WebSocket connection
 * - Push notifications
 */
async function offerRideToDriver(
  ride_id: string,
  driver: Driver,
  timeout_ms: number
): Promise<boolean> {
  // Create a ride offer record
  const { data: offer } = await supabase
    .from('driver_offers')
    .insert({
      ride_id,
      driver_id: driver.driver_id,
      status: 'pending',
      offered_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (!offer) {
    throw new Error('Failed to create driver offer');
  }

  // In production, send actual notification here
  // await sendPushNotification(driver.user_id, ride_id);

  // Mock: Wait with timeout for driver response
  // In production, would listen to real-time updates or webhook callbacks
  const startTime = Date.now();

  while (Date.now() - startTime < timeout_ms) {
    // Check if driver responded
    const { data: response } = await supabase
      .from('driver_offers')
      .select('status')
      .eq('id', offer.id)
      .single();

    if (response?.status === 'accepted') {
      return true;
    }

    if (response?.status === 'rejected') {
      return false;
    }

    // Wait before checking again
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Timeout - mark as expired
  await supabase
    .from('driver_offers')
    .update({ status: 'expired' })
    .eq('id', offer.id);

  return false;
}

/**
 * Update ride status in database
 */
async function updateRideStatus(ride_id: string, status: string): Promise<void> {
  const { error } = await supabase
    .from('rides')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', ride_id);

  if (error) {
    console.error('Error updating ride status:', error);
  }
}

/**
 * CORS headers for API response
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Send CORS-enabled JSON response
 */
function corsResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status,
  });
}
