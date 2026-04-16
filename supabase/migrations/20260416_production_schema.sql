-- PYU-GO Production Database Schema
-- Phase 1: Core Tables

-- 1. EXTENDED PROFILES (with financial data)
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users ON DELETE CASCADE,
  balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  total_earned DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  total_spent DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_wallets_updated_at ON wallets(updated_at);

-- 2. TRANSACTIONS (all financial movements)
CREATE TYPE transaction_type AS ENUM ('payment', 'refund', 'topup', 'referral', 'commission', 'promo');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'expired');

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  type transaction_type NOT NULL,
  status transaction_status NOT NULL DEFAULT 'pending',
  amount DECIMAL(15, 2) NOT NULL,
  description TEXT,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  payment_method VARCHAR(50),
  gateway_transaction_id VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_booking_id ON transactions(booking_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);

-- 3. DRIVER PROFILES (extended)
CREATE TYPE driver_status AS ENUM ('pending', 'verified', 'active', 'suspended', 'inactive');

CREATE TABLE IF NOT EXISTS driver_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users ON DELETE CASCADE,
  status driver_status NOT NULL DEFAULT 'pending',
  license_number VARCHAR(50) NOT NULL UNIQUE,
  license_expiry DATE NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  total_trips INT NOT NULL DEFAULT 0,
  total_earnings DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
  rating DECIMAL(3, 2) NOT NULL DEFAULT 5.00,
  rating_count INT NOT NULL DEFAULT 0,
  vehicle_type VARCHAR(50), -- motorcycle, car, auto
  vehicle_plate VARCHAR(20),
  vehicle_color VARCHAR(30),
  cancellation_rate DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
  acceptance_rate DECIMAL(5, 2) NOT NULL DEFAULT 100.00,
  last_online TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_driver_profiles_user_id ON driver_profiles(user_id);
CREATE INDEX idx_driver_profiles_status ON driver_profiles(status);
CREATE INDEX idx_driver_profiles_rating ON driver_profiles(rating DESC);

-- 4. RATINGS
CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  rater_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  ratee_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_helpful BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_ratings_booking_id ON ratings(booking_id);
CREATE INDEX idx_ratings_rater_id ON ratings(rater_id);
CREATE INDEX idx_ratings_ratee_id ON ratings(ratee_id);
CREATE INDEX idx_ratings_created_at ON ratings(created_at DESC);

-- 5. REFUNDS
CREATE TYPE refund_reason AS ENUM (
  'driver_not_found',
  'user_cancelled',
  'driver_cancelled',
  'trip_incomplete',
  'payment_failed',
  'support_override',
  'dispute_resolved'
);
CREATE TYPE refund_status AS ENUM ('pending', 'approved', 'rejected', 'processed', 'failed');

CREATE TABLE IF NOT EXISTS refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  reason refund_reason NOT NULL,
  status refund_status NOT NULL DEFAULT 'pending',
  amount DECIMAL(15, 2) NOT NULL,
  notes TEXT,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_refunds_transaction_id ON refunds(transaction_id);
CREATE INDEX idx_refunds_booking_id ON refunds(booking_id);
CREATE INDEX idx_refunds_status ON refunds(status);

-- 6. NOTIFICATIONS
CREATE TYPE notification_type AS ENUM (
  'ride_accepted',
  'driver_arriving',
  'ride_started',
  'ride_completed',
  'payment_confirmed',
  'refund_processed',
  'rating_reminder',
  'support_response',
  'promo_available',
  'driver_alert',
  'system_alert'
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  type notification_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- 7. PROMO CODES
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) NOT NULL UNIQUE,
  discount_type VARCHAR(20), -- percentage, fixed
  discount_value DECIMAL(15, 2) NOT NULL,
  max_uses INT,
  current_uses INT DEFAULT 0,
  min_booking_amount DECIMAL(15, 2) DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_is_active ON promo_codes(is_active);

-- 8. ANALYTICS EVENTS
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  event_name VARCHAR(100) NOT NULL,
  event_properties JSONB,
  user_properties JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);

-- 9. DEVICE TOKENS (for push notifications)
CREATE TABLE IF NOT EXISTS device_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL,
  platform VARCHAR(20), -- ios, android, web
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, token)
);

CREATE INDEX idx_device_tokens_user_id ON device_tokens(user_id);

-- 10. SUPPORT TICKETS
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');

CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status ticket_status NOT NULL DEFAULT 'open',
  priority VARCHAR(20), -- low, medium, high, urgent
  assigned_to UUID REFERENCES auth.users ON DELETE SET NULL,
  resolution_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_created_at ON support_tickets(created_at DESC);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES (simplified - add more specific policies as needed)

-- Wallets: Users can only see their own wallet
CREATE POLICY "Users can view own wallet" ON wallets
  FOR SELECT USING (user_id = auth.uid());

-- Transactions: Users can see their own transactions
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (user_id = auth.uid());

-- Notifications: Users can see their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

-- Device Tokens: Users can only manage their own
CREATE POLICY "Users can manage own device tokens" ON device_tokens
  FOR ALL USING (user_id = auth.uid());

-- Support Tickets: Users can see their own tickets
CREATE POLICY "Users can view own support tickets" ON support_tickets
  FOR SELECT USING (user_id = auth.uid());
