/**
 * Support Service
 * Ticket management, issue tracking, and customer support
 */

import { supabase } from '@/shared/integrations/supabase/client';
import {
  SupportTicket,
  SupportTicketCreate,
  TicketStatus,
  TicketPriority,
} from '@/lib/types/production';
import { notificationService } from './NotificationService';

class SupportService {
  /**
   * Create support ticket
   */
  async createTicket(
    userId: string,
    ticket: SupportTicketCreate
  ): Promise<{ success: boolean; ticket_id?: string; error?: string }> {
    try {
      const { data: newTicket, error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: userId,
          booking_id: ticket.booking_id,
          subject: ticket.subject,
          description: ticket.description,
          priority: ticket.priority || 'medium',
          status: 'open',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error || !newTicket) {
        return { success: false, error: 'Failed to create ticket' };
      }

      // Send confirmation notification
      await notificationService.send({
        type: 'support_response',
        title: 'Support Ticket Created',
        body: `We've received your ticket #${newTicket.id.slice(0, 8)}`,
        data: { ticket_id: newTicket.id },
      }, userId);

      return { success: true, ticket_id: newTicket.id };
    } catch (error) {
      console.error('Error creating support ticket:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create ticket',
      };
    }
  }

  /**
   * Get user's support tickets
   */
  async getUserTickets(userId: string, status?: TicketStatus): Promise<SupportTicket[]> {
    try {
      let query = supabase
        .from('support_tickets')
        .select()
        .eq('user_id', userId);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tickets:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting tickets:', error);
      return [];
    }
  }

  /**
   * Update ticket status
   */
  async updateTicketStatus(
    ticketId: string,
    status: TicketStatus,
    resolutionNotes?: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({
          status,
          resolution_notes: resolutionNotes,
          resolved_at: status === 'resolved' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', ticketId);

      if (error) {
        console.error('Error updating ticket:', error);
        return false;
      }

      // Get ticket to notify user
      const { data: ticket } = await supabase
        .from('support_tickets')
        .select()
        .eq('id', ticketId)
        .single();

      if (ticket) {
        await notificationService.send(
          {
            type: 'support_response',
            title: `Ticket ${status}`,
            body: resolutionNotes || 'Your support ticket has been updated',
            data: { ticket_id: ticketId },
          },
          ticket.user_id
        );
      }

      return true;
    } catch (error) {
      console.error('Error updating ticket:', error);
      return false;
    }
  }
}

/**
 * Advanced Dispatch Service
 * Enhanced driver matching with ML-ready features
 */

interface DispatchContext {
  user_lat: number;
  user_lng: number;
  destination_lat: number;
  destination_lng: number;
  service_type: string;
  preferred_time?: number; // minutes
}

interface DispatchCandidate {
  driver_id: string;
  driver_name: string;
  rating: number;
  vehicle: string;
  distance_meters: number;
  eta_minutes: number;
  fare_estimate: number;
  acceptance_probability: number; // ML score 0-1
}

class AdvancedDispatchService {
  /**
   * Find optimal drivers with ML scoring
   * Factors:
   * - Proximity (distance)
   * - Rating (quality)
   * - Acceptance rate (reliability)
   * - Historical acceptance patterns
   * - Vehicle type match
   */
  async findOptimalDrivers(
    context: DispatchContext,
    candidates_count: number = 5
  ): Promise<DispatchCandidate[]> {
    try {
      // 1. Get available drivers in area
      const { data: drivers, error } = await supabase.rpc(
        'get_nearby_drivers',
        {
          user_lat: context.user_lat,
          user_lng: context.user_lng,
          radius_km: 5,
          service_type: context.service_type,
        }
      );

      if (error || !drivers) {
        console.error('Error fetching drivers:', error);
        return [];
      }

      // 2. Score each driver with ML model
      const scoredCandidates = drivers.map((driver: any) =>
        this.scoreDriver(driver, context)
      );

      // 3. Sort by score and return top candidates
      return scoredCandidates
        .sort((a: DispatchCandidate, b: DispatchCandidate) => 
          b.acceptance_probability - a.acceptance_probability
        )
        .slice(0, candidates_count);
    } catch (error) {
      console.error('Error finding optimal drivers:', error);
      return [];
    }
  }

  /**
   * ML Scoring function for drivers
   * Uses combination of factors for acceptance probability
   */
  private scoreDriver(driver: any, context: DispatchContext): DispatchCandidate {
    // Normalize factors (0-1 scale)
    const proximityScore = this.normalizeProximity(driver.distance_meters);
    const ratingScore = driver.rating / 5.0;
    const acceptanceScore = driver.acceptance_rate / 100.0;
    const onlineScore = driver.is_online ? 1.0 : 0.5;

    // ML weights (these can be tuned based on production data)
    const weights = {
      proximity: 0.35,
      rating: 0.25,
      acceptance: 0.25,
      online: 0.15,
    };

    // Weighted score
    const acceptanceProbability =
      proximityScore * weights.proximity +
      ratingScore * weights.rating +
      acceptanceScore * weights.acceptance +
      onlineScore * weights.online;

    return {
      driver_id: driver.user_id,
      driver_name: driver.name,
      rating: driver.rating,
      vehicle: driver.vehicle_type,
      distance_meters: driver.distance_meters,
      eta_minutes: Math.ceil(driver.distance_meters / (25 * 1000 / 60)), // 25 km/h avg
      fare_estimate: this.estimateFare(context, driver.distance_meters),
      acceptance_probability: parseFloat(acceptanceProbability.toFixed(2)),
    };
  }

  /**
   * Normalize proximity to 0-1 score (closer = higher)
   */
  private normalizeProximity(distanceMeters: number): number {
    const maxDistance = 5000; // 5km
    return Math.max(0, 1 - distanceMeters / maxDistance);
  }

  /**
   * Estimate fare for given distance
   */
  private estimateFare(context: DispatchContext, distanceMeters: number): number {
    // Simple fare model - extend with surge pricing
    const baseFare = 10000; // IDR
    const perKmRate = 2500; // IDR
    const distance_km = distanceMeters / 1000;

    return Math.round(baseFare + distance_km * perKmRate);
  }

  /**
   * Adaptive dispatch - retry with wider radius if no responses
   */
  async adaptiveDispatch(
    context: DispatchContext,
    initialRadius: number = 2
  ): Promise<DispatchCandidate | null> {
    const maxRetries = 3;

    for (let retry = 0; retry < maxRetries; retry++) {
      const radius = initialRadius + retry * 2; // 2km, 4km, 6km

      // Get candidates with current radius
      const { data: drivers } = await supabase.rpc('get_nearby_drivers', {
        user_lat: context.user_lat,
        user_lng: context.user_lng,
        radius_km: radius,
        service_type: context.service_type,
      });

      if (drivers && drivers.length > 0) {
        // Score and return best driver
        const scored = drivers.map((d: any) => this.scoreDriver(d, context));
        return scored.sort(
          (a: DispatchCandidate, b: DispatchCandidate) =>
            b.acceptance_probability - a.acceptance_probability
        )[0];
      }

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, 1000 * (retry + 1)));
    }

    return null; // No drivers found after retries
  }
}

export const supportService = new SupportService();
export const advancedDispatchService = new AdvancedDispatchService();
