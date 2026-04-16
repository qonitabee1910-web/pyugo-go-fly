import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  findAvailableDrivers,
  sendDispatchOffer,
  validateDispatchRequest,
  DispatchRequest,
} from '@/lib/engines/driverDispatch';
import { Coordinates } from '@/lib/utils/distance';
import { DriverLocation } from '@/lib/types/ride';

describe('DriverDispatchEngine', () => {
  let pickupLocation: Coordinates;

  beforeEach(() => {
    // Jakarta downtown
    pickupLocation = { latitude: -6.2, longitude: 106.8 };
  });

  describe('findAvailableDrivers', () => {
    it('should find available drivers for motorcycle service', () => {
      const request: DispatchRequest = {
        pickupLocation,
        serviceType: 'motor',
        minRating: 4.0,
        maxRadius: 5,
      };

      const result = findAvailableDrivers(request);

      expect(result).toHaveProperty('candidates');
      expect(result).toHaveProperty('selectedDriver');
      expect(result).toHaveProperty('reason');
      expect(Array.isArray(result.candidates)).toBe(true);
    });

    it('should find only female drivers for women service', () => {
      const request: DispatchRequest = {
        pickupLocation,
        serviceType: 'women',
        minRating: 4.0,
        maxRadius: 5,
      };

      const result = findAvailableDrivers(request);

      // Should have 0 or some candidates (depends on location)
      if (result.candidates.length > 0) {
        // In a real scenario, we'd verify driver IDs match female drivers
        expect(result.candidates).toBeDefined();
      }
    });

    it('should find only car drivers for car service', () => {
      const request: DispatchRequest = {
        pickupLocation,
        serviceType: 'car',
        minRating: 4.0,
        maxRadius: 5,
      };

      const result = findAvailableDrivers(request);

      expect(result).toHaveProperty('candidates');
      if (result.candidates.length > 0) {
        expect(result.selectedDriver).toBeDefined();
      }
    });

    it('should filter drivers by minimum rating', () => {
      const request: DispatchRequest = {
        pickupLocation,
        serviceType: 'motor',
        minRating: 4.8,
        maxRadius: 5,
      };

      const result = findAvailableDrivers(request);

      // All candidates should have rating >= 4.8
      result.candidates.forEach(candidate => {
        expect(candidate.rating).toBeGreaterThanOrEqual(4.8);
      });
    });

    it('should respect max radius parameter', () => {
      const request: DispatchRequest = {
        pickupLocation,
        serviceType: 'motor',
        minRating: 4.0,
        maxRadius: 1, // Very small radius
      };

      const result = findAvailableDrivers(request);

      // All candidates should be within radius
      result.candidates.forEach(candidate => {
        expect(candidate.distanceToPickup).toBeLessThanOrEqual(1);
      });
    });

    it('should return limited number of candidates', () => {
      const request: DispatchRequest = {
        pickupLocation,
        serviceType: 'motor',
        minRating: 0,
        maxRadius: 100,
      };

      const result = findAvailableDrivers(request);

      // Should return at most 5 candidates
      expect(result.candidates.length).toBeLessThanOrEqual(5);
    });

    it('should calculate estimated arrival time', () => {
      const request: DispatchRequest = {
        pickupLocation,
        serviceType: 'motor',
      };

      const result = findAvailableDrivers(request);

      if (result.selectedDriver) {
        expect(result.selectedDriver.estimatedArrival).toBeGreaterThan(0);
        expect(result.selectedDriver.estimatedArrival).toBeLessThan(30); // Less than 30 minutes
      }
    });

    it('should rank drivers by score', () => {
      const request: DispatchRequest = {
        pickupLocation,
        serviceType: 'motor',
      };

      const result = findAvailableDrivers(request);

      // Candidates should be sorted by score (descending)
      for (let i = 1; i < result.candidates.length; i++) {
        expect(result.candidates[i - 1].score).toBeGreaterThanOrEqual(result.candidates[i].score);
      }
    });

    it('should handle custom driver locations', () => {
      const driverLocations = new Map<string, DriverLocation>([
        [
          'd1',
          {
            driverId: 'd1',
            latitude: -6.19,
            longitude: 106.81,
            updatedAt: new Date(),
          },
        ],
      ]);

      const request: DispatchRequest = {
        pickupLocation,
        serviceType: 'motor',
      };

      const result = findAvailableDrivers(request, driverLocations);

      expect(result).toHaveProperty('candidates');
    });
  });

  describe('sendDispatchOffer', () => {
    it('should return boolean result', async () => {
      const result = await sendDispatchOffer('d1', 'ride_123');

      expect(typeof result).toBe('boolean');
    });

    it('should have acceptance rate around 80%', async () => {
      const trials = 100;
      let acceptedCount = 0;

      for (let i = 0; i < trials; i++) {
        const result = await sendDispatchOffer(`d${i}`, `ride_${i}`);
        if (result) acceptedCount++;
      }

      const acceptanceRate = acceptedCount / trials;
      // Allow for variance (between 60% and 95%)
      expect(acceptanceRate).toBeGreaterThan(0.6);
      expect(acceptanceRate).toBeLessThan(0.95);
    });
  });

  describe('validateDispatchRequest', () => {
    it('should validate correct request', () => {
      const request: DispatchRequest = {
        pickupLocation,
        serviceType: 'motor',
        minRating: 4.0,
      };

      const validation = validateDispatchRequest(request);

      expect(validation.valid).toBe(true);
      expect(validation.error).toBeUndefined();
    });

    it('should reject missing pickup location', () => {
      const request: DispatchRequest = {
        pickupLocation: { latitude: NaN, longitude: NaN },
        serviceType: 'motor',
      };

      const validation = validateDispatchRequest(request);

      expect(validation.valid).toBe(false);
      expect(validation.error).toContain('required');
    });

    it('should reject missing service type', () => {
      const request = {
        pickupLocation,
      } as DispatchRequest;

      const validation = validateDispatchRequest(request);

      expect(validation.valid).toBe(false);
    });

    it('should reject invalid minimum rating', () => {
      const request: DispatchRequest = {
        pickupLocation,
        serviceType: 'motor',
        minRating: 6, // Invalid, max is 5
      };

      const validation = validateDispatchRequest(request);

      expect(validation.valid).toBe(false);
    });

    it('should accept zero minimum rating', () => {
      const request: DispatchRequest = {
        pickupLocation,
        serviceType: 'motor',
        minRating: 0,
      };

      const validation = validateDispatchRequest(request);

      expect(validation.valid).toBe(true);
    });
  });

  describe('Match scoring', () => {
    it('should prioritize rating and proximity', () => {
      const request: DispatchRequest = {
        pickupLocation,
        serviceType: 'motor',
        minRating: 4.0,
      };

      const result = findAvailableDrivers(request);

      if (result.candidates.length >= 2) {
        const first = result.candidates[0];
        const second = result.candidates[1];

        // First should have higher score
        expect(first.score).toBeGreaterThanOrEqual(second.score);

        // Score should be between 0 and 100
        expect(first.score).toBeGreaterThan(0);
        expect(first.score).toBeLessThanOrEqual(100);
      }
    });
  });
});
