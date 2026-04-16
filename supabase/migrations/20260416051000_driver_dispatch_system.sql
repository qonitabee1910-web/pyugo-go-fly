/**
 * Driver Dispatch SQL Utilities
 * 
 * PostGIS-based geospatial queries and ranking algorithms
 * Run this as a Supabase migration to set up the dispatch system
 */

-- ============================================
-- DRIVER PROFILE & LOCATION TRACKING
-- ============================================

-- Drivers table (extends auth.users)
CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  vehicle_type TEXT CHECK (vehicle_type IN ('motorcycle', 'car', 'auto')),
  vehicle_plate TEXT,
  vehicle_color TEXT,
  rating DECIMAL(3, 2) DEFAULT 5.0,
  total_trips INT DEFAULT 0,
  acceptance_rate DECIMAL(3, 2) DEFAULT 1.0,
  
  -- Status tracking
  status TEXT DEFAULT 'offline' CHECK (status IN ('offline', 'online', 'busy')),
  last_idle_at TIMESTAMP,
  
  -- Documents & verification
  verified BOOLEAN DEFAULT false,
  photo_url TEXT,
  
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id)
);

-- Current driver locations (updated in real-time via app)
CREATE TABLE IF NOT EXISTS driver_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL UNIQUE REFERENCES drivers(id) ON DELETE CASCADE,
  latitude DECIMAL(9, 6) NOT NULL,
  longitude DECIMAL(9, 6) NOT NULL,
  
  -- PostGIS geometry column for efficient geospatial queries
  geom GEOMETRY(Point, 4326) GENERATED ALWAYS AS (
    ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
  ) STORED,
  
  heading INT, -- 0-359 degrees
  speed DECIMAL(5, 2), -- km/h
  accuracy INT, -- meters
  
  updated_at TIMESTAMP DEFAULT now(),
  
  INDEX idx_driver_geom ON driver_locations USING GIST(geom)
);

-- Driver offer history (for dispatch tracking)
CREATE TABLE IF NOT EXISTS driver_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  
  offered_at TIMESTAMP DEFAULT now(),
  responded_at TIMESTAMP,
  
  response_time_ms INT, -- How long driver took to respond
  
  created_at TIMESTAMP DEFAULT now(),
  
  UNIQUE(ride_id, driver_id) -- One offer per ride/driver combo
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_drivers_status ON drivers(status) WHERE status != 'offline';
CREATE INDEX idx_drivers_rating ON drivers(rating DESC);
CREATE INDEX idx_drivers_updated ON drivers(updated_at DESC);

CREATE INDEX idx_driver_locations_updated ON driver_locations(updated_at DESC);

CREATE INDEX idx_driver_offers_ride ON driver_offers(ride_id);
CREATE INDEX idx_driver_offers_driver ON driver_offers(driver_id);
CREATE INDEX idx_driver_offers_status ON driver_offers(status);
CREATE INDEX idx_driver_offers_created ON driver_offers(created_at DESC);

-- ============================================
-- POSTGIS SPATIAL FUNCTIONS
-- ============================================

/**
 * Get nearby drivers sorted by distance, rating, and idle time
 * 
 * Ranking algorithm:
 * 1. Primary: Distance (closest first)
 * 2. Secondary: Rating (highest rated)
 * 3. Tertiary: Idle time (longest idle first)
 * 
 * Args:
 *   p_latitude: Pickup latitude
 *   p_longitude: Pickup longitude
 *   p_radius_meters: Search radius (default 5000)
 *   p_limit: Max drivers to return (default 10)
 * 
 * Returns:
 *   Sorted list of available drivers with distance calculated
 */
CREATE OR REPLACE FUNCTION get_nearby_drivers(
  p_latitude DECIMAL,
  p_longitude DECIMAL,
  p_radius_meters INT DEFAULT 5000,
  p_limit INT DEFAULT 10
)
RETURNS TABLE (
  driver_id UUID,
  user_id UUID,
  name TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  rating DECIMAL,
  distance_meters INT,
  idle_minutes INT,
  acceptance_probability DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id as driver_id,
    d.user_id,
    d.name,
    dl.latitude,
    dl.longitude,
    d.rating,
    CAST(
      ST_Distance(
        ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326),
        dl.geom
      ) * 111320.0 -- Convert degrees to meters (at equator)
      AS INT
    ) as distance_meters,
    CAST(
      EXTRACT(EPOCH FROM (now() - d.last_idle_at)) / 60.0 AS INT
    ) as idle_minutes,
    d.acceptance_rate as acceptance_probability
  FROM drivers d
  INNER JOIN driver_locations dl ON d.id = dl.driver_id
  WHERE
    -- Driver is online and not busy
    d.status = 'online'
    -- AND d.vehicle_type = p_vehicle_type (optional filter for vehicle type)
    -- Within search radius
    AND ST_DWithin(
      ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326),
      dl.geom,
      p_radius_meters / 111320.0 -- Convert meters to degrees
    )
  ORDER BY
    -- Sort by distance first (ascending)
    distance_meters ASC,
    -- Then by rating (descending - best rated first)
    d.rating DESC,
    -- Finally by idle time (descending - been idle longest)
    idle_minutes DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

/**
 * Find drivers by bounding box (alternative to radius search)
 * Useful for quick searches in rectangular areas
 */
CREATE OR REPLACE FUNCTION get_drivers_in_bbox(
  p_min_lat DECIMAL,
  p_min_lng DECIMAL,
  p_max_lat DECIMAL,
  p_max_lng DECIMAL,
  p_limit INT DEFAULT 20
)
RETURNS TABLE (
  driver_id UUID,
  name TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  rating DECIMAL,
  distance_meters INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    d.name,
    dl.latitude,
    dl.longitude,
    d.rating,
    0 as distance_meters -- Not calculated in bbox search
  FROM drivers d
  INNER JOIN driver_locations dl ON d.id = dl.driver_id
  WHERE
    d.status = 'online'
    AND dl.latitude BETWEEN p_min_lat AND p_max_lat
    AND dl.longitude BETWEEN p_min_lng AND p_max_lng
  ORDER BY d.rating DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in kilometers
 */
CREATE OR REPLACE FUNCTION haversine_distance(
  p_lat1 DECIMAL,
  p_lng1 DECIMAL,
  p_lat2 DECIMAL,
  p_lng2 DECIMAL
)
RETURNS DECIMAL AS $$
DECLARE
  v_lat1_rad DECIMAL;
  v_lng1_rad DECIMAL;
  v_lat2_rad DECIMAL;
  v_lng2_rad DECIMAL;
  v_dlat DECIMAL;
  v_dlng DECIMAL;
  v_a DECIMAL;
  v_c DECIMAL;
  v_r DECIMAL := 6371; -- Earth radius in km
BEGIN
  v_lat1_rad := RADIANS(p_lat1);
  v_lng1_rad := RADIANS(p_lng1);
  v_lat2_rad := RADIANS(p_lat2);
  v_lng2_rad := RADIANS(p_lng2);
  
  v_dlat := v_lat2_rad - v_lat1_rad;
  v_dlng := v_lng2_rad - v_lng1_rad;
  
  v_a := SIN(v_dlat / 2) * SIN(v_dlat / 2) +
         COS(v_lat1_rad) * COS(v_lat2_rad) *
         SIN(v_dlng / 2) * SIN(v_dlng / 2);
  
  v_c := 2 * ASIN(SQRT(v_a));
  
  RETURN v_r * v_c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

/**
 * Get dispatch statistics for a ride
 * Shows how dispatch attempt went
 */
CREATE OR REPLACE FUNCTION get_dispatch_stats(p_ride_id UUID)
RETURNS TABLE (
  total_offers INT,
  accepted_count INT,
  rejected_count INT,
  expired_count INT,
  avg_response_time_ms DECIMAL,
  time_to_assignment_sec INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INT as total_offers,
    COUNT(*) FILTER (WHERE status = 'accepted')::INT,
    COUNT(*) FILTER (WHERE status = 'rejected')::INT,
    COUNT(*) FILTER (WHERE status = 'expired')::INT,
    AVG(response_time_ms)::DECIMAL,
    CAST(
      EXTRACT(EPOCH FROM (
        SELECT responded_at FROM driver_offers
        WHERE ride_id = p_ride_id AND status = 'accepted'
        ORDER BY responded_at LIMIT 1
      ) - (SELECT created_at FROM rides WHERE id = p_ride_id LIMIT 1))
      AS INT
    ) as time_to_assignment_sec
  FROM driver_offers
  WHERE ride_id = p_ride_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- TRIGGERS & AUTOMATIONS
-- ============================================

/**
 * Auto-update driver last_idle_at when status changes to 'online'
 */
CREATE OR REPLACE FUNCTION update_driver_idle_on_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'online' AND OLD.status != 'online' THEN
    NEW.last_idle_at := now();
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS drivers_status_change ON drivers;
CREATE TRIGGER drivers_status_change
BEFORE UPDATE ON drivers
FOR EACH ROW
EXECUTE FUNCTION update_driver_idle_on_status();

/**
 * Auto-update driver_locations timestamp
 */
CREATE OR REPLACE FUNCTION update_driver_location_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS driver_locations_update ON driver_locations;
CREATE TRIGGER driver_locations_update
BEFORE UPDATE ON driver_locations
FOR EACH ROW
EXECUTE FUNCTION update_driver_location_timestamp();

-- ============================================
-- ROW-LEVEL SECURITY
-- ============================================

ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_offers ENABLE ROW LEVEL SECURITY;

-- Drivers can view their own profile
CREATE POLICY "Drivers can view own profile"
  ON drivers FOR SELECT
  USING (auth.uid() = user_id);

-- Edge Functions can access drivers via service role
-- (no RLS restriction needed, uses service_role key)

-- ============================================
-- PERFORMANCE OPTIMIZATION
-- ============================================

-- Enable BRIN index for timestamp columns (better for range queries)
CREATE INDEX idx_driver_offers_created_brin ON driver_offers USING BRIN (created_at);
CREATE INDEX idx_driver_locations_updated_brin ON driver_locations USING BRIN (updated_at);

-- Enable statistics for planner optimization
ANALYZE drivers;
ANALYZE driver_locations;
ANALYZE driver_offers;
