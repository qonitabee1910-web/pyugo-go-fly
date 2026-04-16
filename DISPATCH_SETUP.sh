#!/bin/bash
# Driver Dispatch System - Setup and Deployment Guide
#
# This guide walks through setting up the complete driver dispatch system
# on Supabase for the PYU-GO ride-hailing platform.

# ============================================
# STEP 1: DATABASE MIGRATION
# ============================================
echo "STEP 1: Deploying database schema..."
echo "Run this command:"
echo ""
echo "  supabase db push"
echo ""
echo "This will:"
echo "  ✓ Create drivers table"
echo "  ✓ Create driver_locations table with GIST spatial index"
echo "  ✓ Create driver_offers table"
echo "  ✓ Create PostGIS functions (get_nearby_drivers, etc)"
echo "  ✓ Set up RLS policies"
echo "  ✓ Create indexes for performance"
echo ""
echo "After running, verify with:"
echo "  supabase db shell"
echo "  \d drivers"
echo ""

# ============================================
# STEP 2: EDGE FUNCTION DEPLOYMENT
# ============================================
echo "STEP 2: Deploying Edge Function..."
echo "Run this command:"
echo ""
echo "  supabase functions deploy dispatch-driver"
echo ""
echo "This will:"
echo "  ✓ Deploy TypeScript function to Supabase Functions"
echo "  ✓ Function URL: https://YOUR_PROJECT.supabase.co/functions/v1/dispatch-driver"
echo ""
echo "After deploying, verify with:"
echo "  supabase functions list"
echo ""

# ============================================
# STEP 3: TEST THE FUNCTION
# ============================================
echo "STEP 3: Testing the function..."
echo "First, create test data in database:"
echo ""
echo "  supabase db shell"
echo ""
echo "Then run these SQL commands:"
echo ""
cat << 'EOF'
-- Insert test driver
INSERT INTO drivers (user_id, name, phone, email, vehicle_type, vehicle_plate, rating, total_trips, acceptance_rate, status, photo_url)
VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'Budi Hartanto',
  '08123456789',
  'budi@example.com',
  'car',
  'B 1234 ABC',
  4.8,
  150,
  0.95,
  'online',
  'https://example.com/budi.jpg'
);

-- Insert driver location
INSERT INTO driver_locations (driver_id, latitude, longitude, heading, speed, accuracy)
VALUES (
  (SELECT id FROM drivers LIMIT 1),
  -6.2088,
  106.6753,
  45.0,
  0,
  10.0
);

-- Query nearby drivers (test PostGIS)
SELECT * FROM get_nearby_drivers(-6.2088, 106.6753, 5000, 10);
EOF

echo ""
echo "Then test the Edge Function:"
echo ""
echo "  curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/dispatch-driver \\"
echo "    -H \"Authorization: Bearer eyJxxx...\" \\"
echo "    -H \"Content-Type: application/json\" \\"
echo "    -d '{"
echo "      \"ride_id\": \"550e8400-e29b-41d4-a716-446655440000\","
echo "      \"pickup_lat\": -6.2088,"
echo "      \"pickup_lng\": 106.6753"
echo "    }'"
echo ""

# ============================================
# STEP 4: INTEGRATION IN REACT APP
# ============================================
echo "STEP 4: Integrating into React app..."
echo ""
echo "The dispatch.service.ts provides these functions:"
echo ""
echo "  1. dispatchDriver(ride_id, lat, lng)"
echo "     → Calls Edge Function, returns driver_id"
echo ""
echo "  2. getNearbyDrivers(lat, lng, radius?, limit?)"
echo "     → Query nearby drivers with PostGIS"
echo ""
echo "  3. updateDriverLocation(driver_id, lat, lng)"
echo "     → Update driver's real-time location"
echo ""
echo "  4. respondToOffer(offer_id, accepted)"
echo "     → Driver accepts/rejects offer"
echo ""
echo "  5. getDispatchStats(ride_id)"
echo "     → Get dispatch analytics"
echo ""

# ============================================
# STEP 5: UPDATE RIDE BOOKING FLOW
# ============================================
echo "STEP 5: Update ride booking component..."
echo ""
echo "In src/features/ride/Ride.tsx or your booking component:"
echo ""
cat << 'EOF'
// After ride is created and confirmed
const ride = await RideService.createRide(
  userId,
  pickupLocation,
  dropoffLocation,
  route,
  serviceType,
  estimatedFare
);

// Dispatch driver automatically
try {
  const driverId = await RideService.dispatchDriver(
    ride.id,
    pickupLocation.latitude,
    pickupLocation.longitude
  );
  
  // Update UI to show "Driver found! ETA: 5 minutes"
  setAssignedDriver(driverId);
  setRideStatus('accepted');
  
} catch (err) {
  // Handle error
  if (err.message.includes('NO_DRIVERS')) {
    setError('No drivers available. Try again in a few moments.');
  } else if (err.message.includes('NO_ACCEPTANCE')) {
    setError('Drivers are busy. Try again soon.');
  }
}
EOF

echo ""

# ============================================
# STEP 6: ENABLE REAL-TIME UPDATES
# ============================================
echo "STEP 6: Enable real-time updates..."
echo ""
echo "Subscribe to driver_offers table to detect when driver accepts:"
echo ""
cat << 'EOF'
supabase
  .channel(`ride:${rideId}`)
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'driver_offers',
      filter: `ride_id=eq.${rideId}`
    },
    (payload) => {
      if (payload.new.status === 'accepted') {
        console.log('Driver accepted!', payload.new.driver_id);
        // Update UI
      }
    }
  )
  .subscribe();
EOF

echo ""

# ============================================
# STEP 7: VERIFY EVERYTHING WORKS
# ============================================
echo "STEP 7: Verification checklist..."
echo ""
echo "☐ Database tables created (drivers, driver_locations, driver_offers)"
echo "☐ PostGIS extension enabled (check: CREATE EXTENSION postgis;)"
echo "☐ Indexes created (check: \d driver_locations | grep gist)"
echo "☐ Edge Function deployed"
echo "☐ Edge Function responds to test request"
echo "☐ Test driver exists in database"
echo "☐ Test driver location exists"
echo "☐ dispatch.service.ts imported in app"
echo "☐ RideService.dispatchDriver() called after ride creation"
echo "☐ Real-time subscriptions active"
echo ""

# ============================================
# STEP 8: PERFORMANCE TUNING
# ============================================
echo "STEP 8: Performance optimization..."
echo ""
echo "To monitor and optimize:"
echo ""
echo "1. Check query performance:"
echo "   SELECT * FROM pg_stat_statements WHERE query LIKE '%get_nearby_drivers%';"
echo ""
echo "2. Monitor spatial index:"
echo "   SELECT * FROM pg_stat_user_indexes WHERE relname LIKE '%driver_geom%';"
echo ""
echo "3. Check connection pool (Supabase dashboard → Database → Connections)"
echo ""
echo "4. Monitor Edge Function logs:"
echo "   supabase functions logs dispatch-driver --limit 100"
echo ""

# ============================================
# STEP 9: TESTING SCENARIOS
# ============================================
echo "STEP 9: Test different scenarios..."
echo ""
echo "Test 1: No drivers available"
echo "  → Set all drivers status='offline'"
echo "  → Dispatch should return NO_DRIVERS error"
echo ""
echo "Test 2: All drivers reject"
echo "  → Manually set driver_offers.status='rejected' during dispatch"
echo "  → Dispatch should return NO_ACCEPTANCE error"
echo ""
echo "Test 3: Driver timeout"
echo "  → Don't update driver_offers during 10s window"
echo "  → Should move to next driver automatically"
echo ""
echo "Test 4: Performance under load"
echo "  → Create 1000 mock drivers"
echo "  → Dispatch multiple rides concurrently"
echo "  → Monitor CPU, memory, query times"
echo ""

# ============================================
# STEP 10: PRODUCTION CHECKLIST
# ============================================
echo "STEP 10: Pre-production checklist..."
echo ""
echo "☐ Enable real-time notifications (Firebase, SMS, or WebSocket)"
echo "☐ Set up error tracking (Sentry, LogRocket)"
echo "☐ Configure rate limiting and throttling"
echo "☐ Enable audit logging for dispatch attempts"
echo "☐ Set up monitoring dashboards (DataDog, New Relic)"
echo "☐ Load test with realistic driver/ride volume"
echo "☐ Implement graceful degradation for edge cases"
echo "☐ Test disaster recovery (DB failover, function downtime)"
echo "☐ Document runbooks for operators"
echo "☐ Set up alerting for anomalies"
echo ""

# ============================================
# TROUBLESHOOTING
# ============================================
echo "TROUBLESHOOTING..."
echo ""
echo "Problem: PostGIS extension not found"
echo "Solution: supabase db shell → CREATE EXTENSION postgis;"
echo ""
echo "Problem: Permission denied when running migration"
echo "Solution: Check you're using admin/service key, not anon key"
echo ""
echo "Problem: Spatial index not used"
echo "Solution: Run ANALYZE table_name; to update query planner statistics"
echo ""
echo "Problem: Edge Function returns 404"
echo "Solution: Check function deployed: supabase functions list"
echo ""
echo "Problem: Slow queries"
echo "Solution: Check indexes exist and run ANALYZE on tables"
echo ""
echo "Problem: No drivers matching"
echo "Solution: Verify driver_locations.geom set correctly"
echo "         SELECT ST_AsText(geom) FROM driver_locations LIMIT 1;"
echo ""
