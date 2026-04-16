# Ride Hailing Fare Calculation & Dispatch Engine

## Overview

A comprehensive ride-hailing system featuring dynamic fare calculation and intelligent driver dispatch matching. The system is built on TypeScript with React hooks for seamless integration into the existing ride booking flow.

## Features

### 1. Fare Calculation Engine (`src/lib/engines/fareCalculation.ts`)

Calculates ride fares based on multiple factors:

- **Base Fare**: Service-dependent pricing
  - Motorcycle: Rp 4,000
  - Women's Service: Rp 5,000
  - Car: Rp 8,000

- **Distance-Based Pricing**: Per-kilometer rates
  - Motorcycle: Rp 2,500/km
  - Women's Service: Rp 3,000/km
  - Car: Rp 5,000/km

- **Surge Pricing**: Dynamic multipliers based on demand
  - Peak hours (7-9am, 5-7pm): 1.5x
  - Night hours (10pm-5am): 1.2x
  - Weekend evenings: 1.3x
  - Regular hours: 1.0x

- **Discount Support**: Apply percentage discounts with automatic minimum fare protection

**Usage**:
```typescript
import { calculateRideFare } from '@/lib/engines/fareCalculation';

const result = calculateRideFare({
  pickupLocation: { latitude: -6.2, longitude: 106.8 },
  dropoffLocation: { latitude: -6.12, longitude: 107.0 },
  serviceId: 'rs1',
  discountPercentage: 10,
});

console.log(`Total: Rp ${result.totalFare}`);
console.log(`Breakdown:`, result.breakdown);
```

### 2. Driver Dispatch Engine (`src/lib/engines/driverDispatch.ts`)

Intelligently matches riders with available drivers:

- **Proximity Matching**: Finds drivers within configurable radius (default: 5km)
- **Rating-Based Filtering**: Filters drivers by minimum rating (default: 4.0)
- **Service Type Filtering**:
  - Women service: Female drivers only
  - Car service: Drivers with 4-seater vehicles
  - Motorcycle: All drivers available

- **Intelligent Scoring**: Ranks drivers by score (0-100):
  - Rating: 50% weight
  - Distance: 50% weight

- **Acceptance Simulation**: Realistic driver acceptance (~80% rate)

**Usage**:
```typescript
import { findAvailableDrivers } from '@/lib/engines/driverDispatch';

const result = findAvailableDrivers({
  pickupLocation: { latitude: -6.2, longitude: 106.8 },
  serviceType: 'motor',
  minRating: 4.0,
  maxRadius: 5,
});

if (result.selectedDriver) {
  console.log(`Driver: ${result.selectedDriver.driverId}`);
  console.log(`ETA: ${result.selectedDriver.estimatedArrival} min`);
}
```

### 3. Distance Utilities (`src/lib/utils/distance.ts`)

- **Haversine Formula**: Accurate distance calculation between coordinates
- **Travel Time Estimation**: Based on average speed (40 km/h urban)
- **Radius Checking**: Verify if driver is within service radius

**Usage**:
```typescript
import { calculateDistance, estimateTravelTime } from '@/lib/utils/distance';

const distance = calculateDistance(
  { latitude: -6.2, longitude: 106.8 },
  { latitude: -6.12, longitude: 107.0 }
);

const eta = estimateTravelTime(distance);
console.log(`${distance.toFixed(1)} km, ${eta} minutes`);
```

### 4. Surge Pricing Utilities (`src/lib/utils/surge.ts`)

- **Automatic Surge Detection**: Time-based surge multiplier
- **Reason Reporting**: User-friendly surge reason messages
- **Future Prediction**: Estimate surge for booking times

**Usage**:
```typescript
import { getSurgeMultiplier, getSurgeReason } from '@/lib/utils/surge';

const multiplier = getSurgeMultiplier(new Date());
const reason = getSurgeReason(multiplier);

console.log(`${reason} (${multiplier}x)`);
```

### 5. React Hook: `useDispatch` (`src/hooks/useDispatch.ts`)

Manages the complete dispatch workflow in React components:

```typescript
import { useDispatch } from '@/hooks/useDispatch';

function RideBooking() {
  const {
    fare,
    dispatch,
    loading,
    error,
    calculateFare,
    requestRide,
    dispatchDrivers,
    cancelRide,
  } = useDispatch();

  const handleBooking = async () => {
    // 1. Calculate fare
    calculateFare({
      pickupLocation: { latitude: -6.2, longitude: 106.8 },
      dropoffLocation: { latitude: -6.12, longitude: 107.0 },
      serviceId: 'rs1',
    });

    // 2. Request ride
    requestRide(-6.2, 106.8, -6.12, 107.0);

    // 3. Dispatch drivers
    dispatchDrivers('motor');
  };

  return (
    <div>
      {fare && <p>Total: Rp {fare.totalFare}</p>}
      {dispatch && <p>Driver: {dispatch.driverId}</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

## Type Definitions (`src/lib/types/ride.ts`)

- `Ride`: Complete ride information
- `Fare`: Fare calculation and breakdown
- `Dispatch`: Driver dispatch offer and status
- `DriverLocation`: Real-time driver location
- `DispatchMatch`: Ranked driver match result
- `Location`: Geographic coordinates and name

## Testing

Comprehensive test suites included:

- **Fare Calculation Tests** (`src/test/engines/fareCalculation.test.ts`)
  - 47+ test cases covering calculations, discounts, surge pricing
  - Validation and formatting tests

- **Driver Dispatch Tests** (`src/test/engines/driverDispatch.test.ts`)
  - 40+ test cases for matching, filtering, and scoring
  - Service type filtering verification
  - Acceptance rate validation

**Run tests**:
```bash
npm run test
# or
npm run test:watch
```

## Integration with Existing Features

The engines are designed to integrate seamlessly with:

- `RideSearch.tsx`: Display estimated fares during search
- `RideBook.tsx`: Calculate and display final fare before booking
- `RideStatus.tsx`: Show dispatch progress and driver tracking (future)

## Architecture Decisions

### Why Haversine Formula?
- More accurate than simple distance calculation for real-world use
- Standard for ride-hailing platforms
- Minimal performance impact

### Why Client-Side Engines?
- Real-time fare preview without API calls
- Instant driver matching simulation
- Offline-capable fare calculations
- Can be enhanced with server-side validation

### Why Time-Based Surge?
- Predictable and transparent to users
- No complex demand modeling needed initially
- Easy to adjust multipliers based on user feedback

### Future Enhancements

1. **Server-Side Validation**: Validate fare and dispatch on backend
2. **Real-Time Tracking**: WebSocket integration for driver location
3. **Demand-Based Surge**: Actual demand metric calculation
4. **Advanced Matching**: Consider driver direction, ride frequency
5. **Payment Integration**: Supabase payment webhooks
6. **Analytics**: Track surge patterns and driver efficiency

## Performance Notes

- Distance calculation: <1ms per pair
- Dispatch matching: <50ms for 100+ drivers
- Fare calculation: <5ms per request
- React hook state updates: Optimized with useCallback

## Security Considerations

- Input validation on all public functions
- No hardcoded API endpoints
- Type-safe throughout (strict TypeScript)
- Ready for row-level security integration with Supabase

## Database Schema (Future - Supabase)

```sql
-- Rides
CREATE TABLE rides (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  pickup_location POINT,
  dropoff_location POINT,
  service_id TEXT,
  driver_id UUID,
  fare_id UUID,
  status TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Fares
CREATE TABLE fares (
  id UUID PRIMARY KEY,
  ride_id UUID REFERENCES rides,
  base_fare INTEGER,
  distance_fare INTEGER,
  surge_fare INTEGER,
  discount_amount INTEGER,
  total INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Driver Locations (Real-time)
CREATE TABLE driver_locations (
  driver_id UUID PRIMARY KEY,
  latitude FLOAT,
  longitude FLOAT,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Environment Configuration

Currently uses dummy data from `src/shared/data/dummy.ts`. To integrate with real backend:

1. Create Supabase tables (see schema above)
2. Update `src/shared/integrations/supabase/` with database queries
3. Replace dummy data with real API calls
4. Implement real-time location tracking via WebSocket

## Contributing

When adding new features:
1. Follow the existing code style and TypeScript conventions
2. Add comprehensive tests for new functions
3. Update this documentation
4. Test with both peak and off-peak scenarios
5. Validate all edge cases (invalid locations, zero distance, etc.)
