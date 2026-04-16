/**
 * Driver Dispatch System - Usage Examples
 * 
 * Shows how to integrate the dispatch system into your ride booking flow
 */

import { dispatchDriver, getDispatchStats, getNearbyDrivers } from '@/integrations/dispatch.service';
import { RideService } from '@/integrations/ride.service';

// ============================================
// EXAMPLE 1: Basic Dispatch Flow
// ============================================

/**
 * Complete ride booking flow with automatic driver dispatch
 */
export async function exampleBasicDispatch() {
  console.log('=== Example 1: Basic Dispatch ===');

  // Step 1: Create ride (already done by RideService.createRide)
  const ride = {
    id: 'ride_123',
    pickup_location: { latitude: -6.2088, longitude: 106.6753 },
    dropoff_location: { latitude: -6.1751, longitude: 106.8249 },
  };

  // Step 2: Call dispatch function
  try {
    const result = await dispatchDriver({
      ride_id: ride.id,
      pickup_lat: ride.pickup_location.latitude,
      pickup_lng: ride.pickup_location.longitude,
    });

    if (result.success) {
      console.log(`✓ Ride assigned to driver: ${result.driver_id}`);
    } else {
      console.log(`✗ Dispatch failed: ${result.error_code} - ${result.error}`);

      // Handle error cases
      if (result.error_code === 'NO_DRIVERS') {
        // Show "no drivers available" screen to user
      } else if (result.error_code === 'NO_ACCEPTANCE') {
        // Show "drivers busy" and offer to retry
      }
    }
  } catch (err) {
    console.error('Dispatch error:', err);
  }
}

// ============================================
// EXAMPLE 2: With Retry Logic
// ============================================

/**
 * Dispatch with automatic retry on failure
 */
export async function exampleDispatchWithRetry(
  ride_id: string,
  pickup_lat: number,
  pickup_lng: number,
  maxRetries = 3
) {
  console.log('=== Example 2: Dispatch with Retry ===');

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`Attempt ${attempt}/${maxRetries}`);

    const result = await dispatchDriver({
      ride_id,
      pickup_lat,
      pickup_lng,
    });

    if (result.success) {
      console.log(`✓ Success on attempt ${attempt}`);
      return result;
    }

    if (attempt < maxRetries) {
      // Wait before retry (exponential backoff)
      const delayMs = Math.pow(2, attempt - 1) * 1000;
      console.log(`Retrying after ${delayMs}ms`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  console.log('✗ Failed after all retries');
  return null;
}

// ============================================
// EXAMPLE 3: Dispatch with Feedback
// ============================================

/**
 * Dispatch with real-time feedback and monitoring
 */
export async function exampleDispatchWithFeedback(
  ride_id: string,
  pickup_lat: number,
  pickup_lng: number,
  onProgress?: (message: string) => void
) {
  console.log('=== Example 3: Dispatch with Feedback ===');

  const status = (msg: string) => {
    console.log(msg);
    onProgress?.(msg);
  };

  status('🔍 Searching for nearby drivers...');

  // First, peek at available drivers before dispatching
  const nearby = await getNearbyDrivers(pickup_lat, pickup_lng, 5000, 10);
  status(`📍 Found ${nearby.length} drivers nearby`);

  if (nearby.length === 0) {
    status('😞 No drivers available');
    return null;
  }

  // Show top drivers to user (optional)
  nearby.slice(0, 3).forEach((driver, i) => {
    status(
      `${i + 1}. ${driver.name} (⭐${driver.rating}, ${driver.distance_meters}m away)`
    );
  });

  status('📲 Sending offers to drivers...');

  const result = await dispatchDriver({
    ride_id,
    pickup_lat,
    pickup_lng,
  });

  if (result.success) {
    status(`✓ Driver ${result.driver_id} accepted your ride!`);

    // Get dispatch stats
    const stats = await getDispatchStats(ride_id);
    if (stats) {
      status(
        `📊 Stats: ${stats.total_offers} offers sent, ${stats.accepted_count} accepted, ⏱️ ${stats.time_to_assignment_sec}s`
      );
    }
  } else {
    status(`✗ ${result.error}`);
  }

  return result;
}

// ============================================
// EXAMPLE 4: Integration with Ride Service
// ============================================

/**
 * Enhanced ride creation with automatic dispatch
 */
export async function exampleIntegratedRideBooking(
  userId: string,
  pickup_location: { latitude: number; longitude: number },
  dropoff_location: { latitude: number; longitude: number },
  service_type: 'motorcycle' | 'car' | 'auto'
) {
  console.log('=== Example 4: Integrated Ride Booking ===');

  try {
    // Step 1: Create ride record
    console.log('Creating ride record...');
    const route = {
      distance_meters: 5000,
      duration_seconds: 600,
    };
    const fare = 75000;

    const ride = await RideService.createRide(
      userId,
      pickup_location,
      dropoff_location,
      route,
      service_type,
      fare
    );
    console.log(`✓ Ride created: ${ride.id}`);

    // Step 2: Dispatch driver
    console.log('Dispatching driver...');
    const dispatch = await dispatchDriver({
      ride_id: ride.id,
      pickup_lat: pickup_location.latitude,
      pickup_lng: pickup_location.longitude,
    });

    if (!dispatch.success) {
      // Update ride status to reflect dispatch failure
      await RideService.updateRideStatus(ride.id, 'no_drivers_available');
      throw new Error(`Dispatch failed: ${dispatch.error}`);
    }

    console.log(`✓ Driver assigned: ${dispatch.driver_id}`);

    // Step 3: Ride is now in 'accepted' state
    return {
      ride_id: ride.id,
      driver_id: dispatch.driver_id,
    };
  } catch (err) {
    console.error('Booking failed:', err);
    throw err;
  }
}

// ============================================
// EXAMPLE 5: Handling Specific Error Cases
// ============================================

/**
 * Comprehensive error handling for different dispatch scenarios
 */
export async function exampleErrorHandling(
  ride_id: string,
  pickup_lat: number,
  pickup_lng: number
) {
  console.log('=== Example 5: Error Handling ===');

  try {
    const result = await dispatchDriver({
      ride_id,
      pickup_lat,
      pickup_lng,
    });

    if (!result.success) {
      switch (result.error_code) {
        case 'NO_DRIVERS':
          // Strategy 1: Expand search radius
          console.log('No drivers in 5km - trying expanded search');
          // Could retry with larger radius via custom query
          break;

        case 'NO_ACCEPTANCE':
          // Strategy 2: Offer surge pricing or retry
          console.log('No drivers accepted - could offer premium or retry later');
          // Update UI to show option to retry or pay premium
          break;

        case 'INVALID_INPUT':
          // Strategy 3: Validate and retry
          console.log('Invalid coordinates - check GPS data');
          // Should not happen if client validates first
          break;

        case 'SERVER_ERROR':
          // Strategy 4: Exponential backoff retry
          console.log('Server error - will retry');
          await new Promise(resolve => setTimeout(resolve, 2000));
          // Could retry dispatch
          break;

        default:
          console.log(`Unknown error: ${result.error_code}`);
      }
    }

    return result;
  } catch (err) {
    console.error('Unexpected error:', err);
    // Log for monitoring
    // Send to error tracking service (Sentry, etc)
  }
}

// ============================================
// EXAMPLE 6: Analytics & Monitoring
// ============================================

/**
 * Track dispatch metrics for analytics and optimization
 */
export async function exampleDispatchAnalytics(ride_id: string) {
  console.log('=== Example 6: Analytics ===');

  // After dispatch completes, get statistics
  const stats = await getDispatchStats(ride_id);

  if (stats) {
    console.log('📊 Dispatch Statistics:');
    console.log(`  Total offers sent: ${stats.total_offers}`);
    console.log(`  Accepted: ${stats.accepted_count}`);
    console.log(`  Rejected: ${stats.rejected_count}`);
    console.log(`  Expired: ${stats.expired_count}`);
    console.log(`  Avg response time: ${stats.avg_response_time_ms}ms`);
    console.log(`  Time to assignment: ${stats.time_to_assignment_sec}s`);

    // Analyze for insights
    const successRate = (stats.accepted_count / stats.total_offers) * 100;
    console.log(`  Success rate: ${successRate.toFixed(1)}%`);

    if (stats.avg_response_time_ms > 5000) {
      console.log('⚠️ Drivers responding slowly - consider adjusting timeout');
    }

    if (successRate < 30) {
      console.log(
        '⚠️ Low acceptance rate - consider expanding search radius or offering incentives'
      );
    }
  }
}

// ============================================
// EXAMPLE 7: Batch Operations
// ============================================

/**
 * Dispatch multiple rides (e.g., batch booking)
 */
export async function exampleBatchDispatch(
  rides: Array<{
    ride_id: string;
    pickup_lat: number;
    pickup_lng: number;
  }>
) {
  console.log('=== Example 7: Batch Dispatch ===');
  console.log(`Dispatching ${rides.length} rides...`);

  const results = await Promise.allSettled(
    rides.map(ride =>
      dispatchDriver({
        ride_id: ride.ride_id,
        pickup_lat: ride.pickup_lat,
        pickup_lng: ride.pickup_lng,
      })
    )
  );

  const successful = results.filter(r => r.status === 'fulfilled' && r.value.success);
  const failed = results.filter(r => r.status === 'rejected' || !r.value.success);

  console.log(`✓ Successful: ${successful.length}/${rides.length}`);
  console.log(`✗ Failed: ${failed.length}/${rides.length}`);

  return {
    successful: successful as any[],
    failed: failed as any[],
  };
}

// ============================================
// EXAMPLE 8: Real-Time Monitoring
// ============================================

/**
 * Monitor dispatch and driver acceptance in real-time
 */
export async function exampleRealtimeMonitoring(ride_id: string) {
  console.log('=== Example 8: Real-Time Monitoring ===');

  // Start dispatch
  console.log('Starting dispatch...');
  const dispatchPromise = dispatchDriver({
    ride_id,
    pickup_lat: -6.2088,
    pickup_lng: 106.6753,
  });

  // Monitor with timeout
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Dispatch timeout')), 30000)
  );

  try {
    const result = await Promise.race([dispatchPromise, timeout]);
    console.log('✓ Dispatch completed:', result);
    return result;
  } catch (err) {
    console.error('✗ Dispatch monitoring error:', err);
    return null;
  }
}

// ============================================
// TESTING HELPER: Mock Driver Response
// ============================================

/**
 * For testing: Simulate driver accepting offer
 * (In production, driver app sends actual response)
 */
export async function testSimulateDriverResponse(
  offerId: string,
  accept: boolean
) {
  console.log(
    `[TEST] Simulating driver ${accept ? 'acceptance' : 'rejection'} for offer ${offerId}`
  );

  // In real system, this would come from driver app
  // For now, would need to manually update driver_offers table
  // or trigger via admin/test API
}

// ============================================
// RUN EXAMPLES
// ============================================

export async function runAllExamples() {
  try {
    await exampleBasicDispatch();
    // Other examples...
  } catch (err) {
    console.error('Error running examples:', err);
  }
}
