/**
 * Surge Pricing Utilities
 * Dynamic pricing based on demand and time
 */

/**
 * Determine surge multiplier based on time
 * Peak hours (7-9am, 5-7pm): 1.5x
 * Regular hours: 1.0x
 * Night hours (10pm-5am): 1.2x
 */
export function getSurgeMultiplier(date: Date = new Date()): number {
  const hour = date.getHours();
  const dayOfWeek = date.getDay();

  // Peak morning hours (7-9am)
  if (hour >= 7 && hour < 9) return 1.5;

  // Peak evening hours (5-7pm)
  if (hour >= 17 && hour < 19) return 1.5;

  // Night premium (10pm-5am)
  if (hour >= 22 || hour < 5) return 1.2;

  // Weekend surge (slightly higher all day)
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    if (hour >= 19 || hour < 2) return 1.3;
  }

  // Regular hours
  return 1.0;
}

/**
 * Calculate surge reason for user transparency
 */
export function getSurgeReason(multiplier: number): string {
  if (multiplier >= 1.5) return 'High demand - peak hours';
  if (multiplier >= 1.3) return 'Moderate demand';
  if (multiplier >= 1.2) return 'Late night surcharge';
  return 'Regular rates';
}

/**
 * Check if surge pricing applies (multiplier > 1.0)
 */
export function isSurgeActive(multiplier: number): boolean {
  return multiplier > 1.0;
}

/**
 * Estimate surge multiplier for a future time
 */
export function estimateSurgeForTime(futureDate: Date): number {
  return getSurgeMultiplier(futureDate);
}
