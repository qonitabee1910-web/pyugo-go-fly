-- Rides Table
CREATE TABLE rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pickup_location JSONB NOT NULL, -- { latitude, longitude, address, placeId }
  dropoff_location JSONB NOT NULL,
  route JSONB NOT NULL, -- { distance_meters, duration_seconds, polyline }
  status TEXT NOT NULL CHECK (status IN ('idle', 'searching', 'accepted', 'ongoing', 'completed', 'cancelled')),
  service_type TEXT NOT NULL CHECK (service_type IN ('motorcycle', 'car', 'auto')),
  estimated_fare DECIMAL(10, 2),
  actual_fare DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(id)
);

-- Ride Assignments Table
CREATE TABLE ride_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id UUID NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'arrived', 'started', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(ride_id)
);

-- Indexes for faster queries
CREATE INDEX idx_rides_user_id ON rides(user_id);
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_rides_created_at ON rides(created_at DESC);
CREATE INDEX idx_ride_assignments_ride_id ON ride_assignments(ride_id);
CREATE INDEX idx_ride_assignments_driver_id ON ride_assignments(driver_id);
CREATE INDEX idx_ride_assignments_status ON ride_assignments(status);

-- Enable Real-time replication
ALTER TABLE rides REPLICA IDENTITY FULL;
ALTER TABLE ride_assignments REPLICA IDENTITY FULL;

-- Row-Level Security Policies
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE ride_assignments ENABLE ROW LEVEL SECURITY;

-- Riders can see their own rides
CREATE POLICY "Users can view their own rides"
  ON rides FOR SELECT
  USING (auth.uid() = user_id);

-- Riders can insert their own rides
CREATE POLICY "Users can create rides"
  ON rides FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Riders can update their own rides
CREATE POLICY "Users can update their own rides"
  ON rides FOR UPDATE
  USING (auth.uid() = user_id);

-- Drivers can view ride assignments (we'll add driver table later)
CREATE POLICY "Anyone can view ride assignments (driver access via driver table)"
  ON ride_assignments FOR SELECT
  USING (true);
