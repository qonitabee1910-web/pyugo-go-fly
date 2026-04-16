import { describe, it, expect, beforeEach } from 'vitest';
import { 
  calculateRideFare, 
  createFareRecord, 
  formatFareDisplay,
  validateFareInput,
  FareCalculationInput,
} from '@/lib/engines/fareCalculation';
import { Coordinates } from '@/lib/utils/distance';

describe('FareCalculationEngine', () => {
  let pickupLocation: Coordinates;
  let dropoffLocation: Coordinates;

  beforeEach(() => {
    // Jakarta downtown to Jakarta port (approximately 15 km)
    pickupLocation = { latitude: -6.2, longitude: 106.8 };
    dropoffLocation = { latitude: -6.12, longitude: 107.0 };
  });

  describe('calculateRideFare', () => {
    it('should calculate basic fare for motor service', () => {
      const input: FareCalculationInput = {
        pickupLocation,
        dropoffLocation,
        serviceId: 'rs1', // Motor
      };

      const result = calculateRideFare(input);

      expect(result).toHaveProperty('baseFare');
      expect(result).toHaveProperty('distanceFare');
      expect(result).toHaveProperty('totalFare');
      expect(result.baseFare).toBe(4000); // Motor base fare
      expect(result.totalFare).toBeGreaterThan(result.baseFare);
    });

    it('should calculate fare for car service with higher rates', () => {
      const input: FareCalculationInput = {
        pickupLocation,
        dropoffLocation,
        serviceId: 'rs3', // Car
      };

      const result = calculateRideFare(input);

      expect(result.baseFare).toBe(8000); // Car base fare
      expect(result.distanceFare).toBeGreaterThan(0);
      expect(result.totalFare).toBeGreaterThan(4000);
    });

    it('should apply surge multiplier during peak hours', () => {
      const peakTime = new Date();
      peakTime.setHours(8); // 8am = peak hour

      const input: FareCalculationInput = {
        pickupLocation,
        dropoffLocation,
        serviceId: 'rs1',
        bookingTime: peakTime,
      };

      const result = calculateRideFare(input);

      expect(result.surgeMultiplier).toBeGreaterThan(1);
      expect(result.surgeFare).toBeGreaterThan(0);
    });

    it('should apply discount correctly', () => {
      const input: FareCalculationInput = {
        pickupLocation,
        dropoffLocation,
        serviceId: 'rs1',
        discountPercentage: 20,
      };

      const result = calculateRideFare(input);

      expect(result.discountAmount).toBeGreaterThan(0);
      expect(result.totalFare).toBeLessThan(
        result.baseFare + result.distanceFare + result.surgeFare
      );
    });

    it('should not apply discount that exceeds base fare', () => {
      const input: FareCalculationInput = {
        pickupLocation,
        dropoffLocation,
        serviceId: 'rs1',
        discountPercentage: 100, // 100% discount
      };

      const result = calculateRideFare(input);

      // Total should be at least base fare
      expect(result.totalFare).toBeGreaterThanOrEqual(result.baseFare);
    });

    it('should calculate distance correctly', () => {
      const input: FareCalculationInput = {
        pickupLocation,
        dropoffLocation,
        serviceId: 'rs1',
      };

      const result = calculateRideFare(input);

      // Jakarta to port is approximately 15-20 km
      expect(result.breakdown.totalDistance).toBeGreaterThan(10);
      expect(result.breakdown.totalDistance).toBeLessThan(30);
    });

    it('should include breakdown information', () => {
      const input: FareCalculationInput = {
        pickupLocation,
        dropoffLocation,
        serviceId: 'rs2', // Women
      };

      const result = calculateRideFare(input);

      expect(result.breakdown).toHaveProperty('baseAmount', 5000);
      expect(result.breakdown).toHaveProperty('perKmRate', 3000);
      expect(result.breakdown).toHaveProperty('totalDistance');
      expect(result.breakdown).toHaveProperty('surgeMultiplier');
    });
  });

  describe('createFareRecord', () => {
    it('should create a valid fare record', () => {
      const input: FareCalculationInput = {
        pickupLocation,
        dropoffLocation,
        serviceId: 'rs1',
      };

      const calculationResult = calculateRideFare(input);
      const record = createFareRecord('ride_123', calculationResult);

      expect(record).toHaveProperty('rideId', 'ride_123');
      expect(record).toHaveProperty('baseFare');
      expect(record).toHaveProperty('total', calculationResult.totalFare);
      expect(record).toHaveProperty('breakdown');
    });
  });

  describe('formatFareDisplay', () => {
    it('should format regular fare without surge', () => {
      const input: FareCalculationInput = {
        pickupLocation,
        dropoffLocation,
        serviceId: 'rs1',
        bookingTime: new Date('2024-01-15 15:00'), // Off-peak
      };

      const result = calculateRideFare(input);
      const display = formatFareDisplay(result);

      expect(display).toContain('Rp');
      expect(display).not.toContain('surge');
    });

    it('should format surge fare with multiplier', () => {
      const input: FareCalculationInput = {
        pickupLocation,
        dropoffLocation,
        serviceId: 'rs1',
        bookingTime: new Date('2024-01-15 08:00'), // Peak hour
      };

      const result = calculateRideFare(input);
      const display = formatFareDisplay(result);

      expect(display).toContain('Rp');
      if (result.surgeMultiplier > 1) {
        expect(display).toContain('surge');
      }
    });
  });

  describe('validateFareInput', () => {
    it('should validate correct input', () => {
      const input: FareCalculationInput = {
        pickupLocation,
        dropoffLocation,
        serviceId: 'rs1',
      };

      const validation = validateFareInput(input);

      expect(validation.valid).toBe(true);
      expect(validation.error).toBeUndefined();
    });

    it('should reject missing service ID', () => {
      const input: FareCalculationInput = {
        pickupLocation,
        dropoffLocation,
        serviceId: '',
      };

      const validation = validateFareInput(input);

      expect(validation.valid).toBe(false);
      expect(validation.error).toBeDefined();
    });

    it('should reject same pickup and dropoff', () => {
      const input: FareCalculationInput = {
        pickupLocation,
        dropoffLocation: pickupLocation,
        serviceId: 'rs1',
      };

      const validation = validateFareInput(input);

      expect(validation.valid).toBe(false);
      expect(validation.error).toContain('must be different');
    });

    it('should reject invalid discount percentage', () => {
      const input: FareCalculationInput = {
        pickupLocation,
        dropoffLocation,
        serviceId: 'rs1',
        discountPercentage: 150,
      };

      const validation = validateFareInput(input);

      expect(validation.valid).toBe(false);
      expect(validation.error).toContain('between 0 and 100');
    });
  });
});
