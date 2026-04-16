/**
 * Analytics Service
 * Track user behavior, conversions, and business metrics
 * Send events to analytics platform
 */

import { supabase } from '@/shared/integrations/supabase/client';
import {
  AnalyticsEvent,
  AnalyticsEventName,
  UserStatistics,
  DriverStatistics,
  RatingStats,
} from '@/lib/types/production';

class AnalyticsService {
  /**
   * Track analytics event
   * Events are stored in database and sent to external platform
   */
  async trackEvent(
    event: AnalyticsEventName,
    properties?: Record<string, any>,
    userId?: string
  ): Promise<boolean> {
    try {
      // Save to database
      const { error } = await supabase.from('analytics_events').insert({
        user_id: userId,
        event_name: event,
        event_properties: properties,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error('Error tracking event:', error);
        return false;
      }

      // TODO: Send to external analytics platform (Mixpanel, Segment, etc.)
      this.sendToExternalPlatform(event, properties, userId);

      return true;
    } catch (error) {
      console.error('Error tracking event:', error);
      return false;
    }
  }

  /**
   * Track purchase event (critical for revenue tracking)
   */
  async trackPurchase(
    userId: string,
    amount: number,
    bookingId: string,
    serviceType: string
  ): Promise<boolean> {
    return this.trackEvent('payment_completed', {
      amount,
      booking_id: bookingId,
      service_type: serviceType,
      currency: 'IDR',
    }, userId);
  }

  /**
   * Track ride completion
   */
  async trackRideCompletion(
    userId: string,
    bookingId: string,
    distance: number,
    duration: number,
    fare: number
  ): Promise<boolean> {
    return this.trackEvent('trip_completed', {
      booking_id: bookingId,
      distance_km: distance,
      duration_minutes: duration,
      fare_amount: fare,
    }, userId);
  }

  /**
   * Track error for debugging
   */
  async trackError(
    errorMessage: string,
    errorCode?: string,
    userId?: string,
    context?: Record<string, any>
  ): Promise<boolean> {
    return this.trackEvent('error_occurred', {
      error_message: errorMessage,
      error_code: errorCode,
      context,
      timestamp: new Date().toISOString(),
    }, userId);
  }

  /**
   * Get user statistics
   * Used for dashboards and user profiles
   */
  async getUserStatistics(userId: string): Promise<UserStatistics | null> {
    try {
      // Get ride bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('total_price, id')
        .eq('user_id', userId)
        .eq('status', 'selesai');

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
        return null;
      }

      const totalRides = bookings?.length || 0;
      const totalSpent = bookings?.reduce((sum, b) => sum + b.total_price, 0) || 0;

      // Get average rating
      const { data: ratings, error: ratingsError } = await supabase
        .from('ratings')
        .select('rating')
        .eq('rater_id', userId);

      if (ratingsError) {
        console.error('Error fetching ratings:', ratingsError);
        return null;
      }

      const averageRating = ratings && ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

      return {
        total_rides: totalRides,
        total_spent: totalSpent,
        average_rating: parseFloat(averageRating.toFixed(2)),
        total_ratings: ratings?.length || 0,
        saved_locations: 0, // TODO: Implement saved locations
        referral_earnings: 0, // TODO: Implement referral tracking
      };
    } catch (error) {
      console.error('Error getting user statistics:', error);
      return null;
    }
  }

  /**
   * Get driver statistics
   */
  async getDriverStatistics(driverId: string): Promise<DriverStatistics | null> {
    try {
      // Get from driver profile
      const { data: driver, error: driverError } = await supabase
        .from('driver_profiles')
        .select(`
          total_trips,
          total_earnings,
          rating,
          cancellation_rate,
          acceptance_rate
        `)
        .eq('user_id', driverId)
        .single();

      if (driverError || !driver) {
        console.error('Error fetching driver profile:', driverError);
        return null;
      }

      return {
        total_trips: driver.total_trips,
        total_earnings: driver.total_earnings,
        average_rating: driver.rating,
        total_ratings: 0, // TODO: Calculate from ratings table
        acceptance_rate: driver.acceptance_rate,
        cancellation_rate: driver.cancellation_rate,
        online_hours: 0, // TODO: Calculate from presence data
      };
    } catch (error) {
      console.error('Error getting driver statistics:', error);
      return null;
    }
  }

  /**
   * Send event to external analytics platform
   * Stub - implement with Mixpanel, Segment, or other
   */
  private sendToExternalPlatform(
    event: AnalyticsEventName,
    properties?: Record<string, any>,
    userId?: string
  ): void {
    try {
      // TODO: Send to Mixpanel, Segment, or custom API
      // Example: segment.track(userId, event, properties);
      console.log(`Analytics: ${event}`, properties);
    } catch (error) {
      console.error('Error sending to analytics platform:', error);
    }
  }
}

/**
 * Rating Service
 * Manages user ratings, reviews, and quality metrics
 */

class RatingService {
  /**
   * Submit rating after ride completion
   */
  async submitRating(
    bookingId: string,
    raterId: string,
    rateeId: string,
    rating: 1 | 2 | 3 | 4 | 5,
    comment?: string
  ): Promise<boolean> {
    try {
      // 1. Create rating record
      const { error: ratingError } = await supabase.from('ratings').insert({
        booking_id: bookingId,
        rater_id: raterId,
        ratee_id: rateeId,
        rating,
        comment,
      });

      if (ratingError) {
        console.error('Error submitting rating:', ratingError);
        return false;
      }

      // 2. Update driver's average rating
      if (ratingError === null) {
        await this.updateDriverRating(rateeId);
      }

      // 3. Track analytics
      analyticsService.trackEvent('rating_submitted', {
        booking_id: bookingId,
        rating_value: rating,
      }, raterId);

      return true;
    } catch (error) {
      console.error('Error submitting rating:', error);
      return false;
    }
  }

  /**
   * Get driver's rating statistics
   */
  async getDriverRatingStats(driverId: string): Promise<RatingStats | null> {
    try {
      const { data: ratings, error } = await supabase
        .from('ratings')
        .select('rating')
        .eq('ratee_id', driverId);

      if (error || !ratings) {
        console.error('Error fetching ratings:', error);
        return null;
      }

      if (ratings.length === 0) {
        return {
          average_rating: 0,
          total_ratings: 0,
          distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        };
      }

      const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      let sum = 0;

      for (const r of ratings) {
        sum += r.rating;
        distribution[r.rating as keyof typeof distribution]++;
      }

      const average = sum / ratings.length;

      return {
        average_rating: parseFloat(average.toFixed(2)),
        total_ratings: ratings.length,
        distribution,
      };
    } catch (error) {
      console.error('Error getting rating stats:', error);
      return null;
    }
  }

  /**
   * Detect and flag suspicious ratings (fraud detection)
   */
  async detectSuspiciousRatings(driverId: string): Promise<string[]> {
    try {
      const { data: recentRatings, error } = await supabase
        .from('ratings')
        .select('rating, created_at')
        .eq('ratee_id', driverId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error || !recentRatings) {
        return [];
      }

      const issues: string[] = [];

      // Check for all 5-star ratings (suspicious if too many)
      const fiveStarCount = recentRatings.filter((r) => r.rating === 5).length;
      if (fiveStarCount === recentRatings.length && recentRatings.length > 5) {
        issues.push('All ratings are 5 stars - potential self-rating');
      }

      // Check for suspicious timing (all ratings within same minute)
      const timestamps = recentRatings.map((r) => new Date(r.created_at).getTime());
      const timeDiff = Math.max(...timestamps) - Math.min(...timestamps);
      if (timeDiff < 60000 && recentRatings.length > 5) {
        issues.push('Multiple ratings in short time period');
      }

      // Check for rating volatility (sudden jump from 1-star to 5-star)
      if (recentRatings.length > 3) {
        const ratings = recentRatings.map((r) => r.rating);
        const variance = this.calculateVariance(ratings);
        if (variance > 2) {
          issues.push('Unusual rating pattern detected');
        }
      }

      return issues;
    } catch (error) {
      console.error('Error detecting suspicious ratings:', error);
      return [];
    }
  }

  /**
   * Update driver's average rating
   * Should be called as trigger or after each new rating
   */
  private async updateDriverRating(driverId: string): Promise<boolean> {
    try {
      const stats = await this.getDriverRatingStats(driverId);

      if (!stats) {
        return false;
      }

      const { error } = await supabase
        .from('driver_profiles')
        .update({
          rating: stats.average_rating,
          rating_count: stats.total_ratings,
        })
        .eq('user_id', driverId);

      if (error) {
        console.error('Error updating driver rating:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating driver rating:', error);
      return false;
    }
  }

  /**
   * Calculate variance for anomaly detection
   */
  private calculateVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squareDiffs = values.map((value) => Math.pow(value - mean, 2));
    return Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / values.length);
  }
}

// Export singletons
export const analyticsService = new AnalyticsService();
export const ratingService = new RatingService();
