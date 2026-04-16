/**
 * Production-Grade Type Definitions
 * All types are fully typed for strict TypeScript
 */

// ============================================================================
// FINANCIAL TYPES
// ============================================================================

export type TransactionType = 'payment' | 'refund' | 'topup' | 'referral' | 'commission' | 'promo';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'expired';

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  total_earned: number;
  total_spent: number;
  updated_at: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  description?: string;
  booking_id?: string;
  payment_method?: string;
  gateway_transaction_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// DRIVER TYPES
// ============================================================================

export type DriverStatus = 'pending' | 'verified' | 'active' | 'suspended' | 'inactive';

export interface DriverProfile {
  id: string;
  user_id: string;
  status: DriverStatus;
  license_number: string;
  license_expiry: string;
  verified_at?: string;
  total_trips: number;
  total_earnings: number;
  rating: number;
  rating_count: number;
  vehicle_type?: string;
  vehicle_plate?: string;
  vehicle_color?: string;
  cancellation_rate: number;
  acceptance_rate: number;
  last_online?: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// RATING TYPES
// ============================================================================

export interface Rating {
  id: string;
  booking_id: string;
  rater_id: string;
  ratee_id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  is_helpful?: boolean;
  created_at: string;
}

export interface RatingStats {
  average_rating: number;
  total_ratings: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

// ============================================================================
// REFUND TYPES
// ============================================================================

export type RefundReason =
  | 'driver_not_found'
  | 'user_cancelled'
  | 'driver_cancelled'
  | 'trip_incomplete'
  | 'payment_failed'
  | 'support_override'
  | 'dispute_resolved';

export type RefundStatus = 'pending' | 'approved' | 'rejected' | 'processed' | 'failed';

export interface Refund {
  id: string;
  transaction_id: string;
  booking_id: string;
  reason: RefundReason;
  status: RefundStatus;
  amount: number;
  notes?: string;
  requested_at: string;
  processed_at?: string;
  created_at: string;
}

export interface RefundRequest {
  booking_id: string;
  reason: RefundReason;
  notes?: string;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export type NotificationType =
  | 'ride_accepted'
  | 'driver_arriving'
  | 'ride_started'
  | 'ride_completed'
  | 'payment_confirmed'
  | 'refund_processed'
  | 'rating_reminder'
  | 'support_response'
  | 'promo_available'
  | 'driver_alert'
  | 'system_alert';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface NotificationPayload {
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  user_id?: string;
  broadcast?: boolean; // for broadcast to all drivers
}

// ============================================================================
// PROMO CODE TYPES
// ============================================================================

export interface PromoCode {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_uses?: number;
  current_uses: number;
  min_booking_amount: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  created_at: string;
}

export interface PromoValidation {
  valid: boolean;
  discount_amount?: number;
  final_amount?: number;
  error?: string;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export type AnalyticsEventName =
  | 'app_opened'
  | 'search_initiated'
  | 'booking_confirmed'
  | 'payment_started'
  | 'payment_completed'
  | 'trip_started'
  | 'trip_completed'
  | 'rating_submitted'
  | 'refund_requested'
  | 'error_occurred'
  | 'support_contacted';

export interface AnalyticsEvent {
  event_name: AnalyticsEventName;
  event_properties?: Record<string, any>;
  user_properties?: Record<string, any>;
  user_id?: string;
  timestamp?: string;
}

// ============================================================================
// SUPPORT TICKET TYPES
// ============================================================================

export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface SupportTicket {
  id: string;
  user_id: string;
  booking_id?: string;
  subject: string;
  description: string;
  status: TicketStatus;
  priority?: TicketPriority;
  assigned_to?: string;
  resolution_notes?: string;
  created_at: string;
  resolved_at?: string;
  updated_at: string;
}

export interface SupportTicketCreate {
  booking_id?: string;
  subject: string;
  description: string;
  priority?: TicketPriority;
}

// ============================================================================
// DEVICE TOKEN TYPES
// ============================================================================

export type DevicePlatform = 'ios' | 'android' | 'web';

export interface DeviceToken {
  id: string;
  user_id: string;
  token: string;
  platform: DevicePlatform;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// PAYMENT TYPES
// ============================================================================

export type PaymentMethod = 'card' | 'ewallet' | 'bank_transfer' | 'cash';
export type PaymentGateway = 'midtrans' | 'stripe' | 'cash_handler';

export interface PaymentIntent {
  id: string;
  booking_id: string;
  amount: number;
  currency: string;
  payment_method: PaymentMethod;
  gateway: PaymentGateway;
  status: TransactionStatus;
  client_secret?: string;
  gateway_id?: string;
}

export interface PaymentCallback {
  transaction_id: string;
  gateway_transaction_id: string;
  status: TransactionStatus;
  amount: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

// ============================================================================
// AGGREGATE TYPES
// ============================================================================

export interface UserStatistics {
  total_rides: number;
  total_spent: number;
  average_rating: number;
  total_ratings: number;
  saved_locations: number;
  referral_earnings: number;
}

export interface DriverStatistics {
  total_trips: number;
  total_earnings: number;
  average_rating: number;
  total_ratings: number;
  acceptance_rate: number;
  cancellation_rate: number;
  online_hours: number;
}
