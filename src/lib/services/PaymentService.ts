/**
 * Payment Service
 * Handles payment processing, escrow, and transaction management
 * Integrates with Midtrans / Stripe
 *
 * @note This is designed as a layer over payment gateways
 * In production, use Midtrans SDK or Stripe SDK directly
 */

import { supabase } from '@/shared/integrations/supabase/client';
import {
  Transaction,
  TransactionType,
  TransactionStatus,
  PaymentIntent,
  PaymentMethod,
  PaymentGateway,
  Wallet,
  RefundRequest,
  PromoValidation,
} from '@/lib/types/production';

interface PaymentConfig {
  gateway: PaymentGateway;
  gatewayKey: string;
  currency: string;
  timeout: number; // milliseconds
}

interface CreatePaymentParams {
  booking_id: string;
  amount: number;
  payment_method: PaymentMethod;
  promo_code?: string;
  description: string;
}

interface PaymentResult {
  success: boolean;
  transaction_id: string;
  gateway_id?: string;
  client_secret?: string;
  error?: string;
  redirect_url?: string;
}

class PaymentService {
  private config: PaymentConfig;
  private retryConfig = {
    maxRetries: 3,
    baseDelay: 1000, // 1 second
    maxDelay: 5000, // 5 seconds
  };

  constructor(config: PaymentConfig) {
    this.config = config;
  }

  /**
   * Initialize payment for a booking
   * Creates transaction record and communicates with payment gateway
   */
  async createPaymentIntent(
    params: CreatePaymentParams,
    userId: string
  ): Promise<PaymentResult> {
    try {
      // 1. Validate booking exists and is pending payment
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select('id, status, total_price')
        .eq('id', params.booking_id)
        .eq('user_id', userId)
        .single();

      if (bookingError || !booking) {
        return {
          success: false,
          transaction_id: '',
          error: 'Booking not found',
        };
      }

      // 2. Apply promo code if provided
      let finalAmount = params.amount;
      let promoId: string | null = null;

      if (params.promo_code) {
        const promoValidation = await this.validatePromo(params.promo_code, params.amount);
        if (promoValidation.valid && promoValidation.final_amount) {
          finalAmount = promoValidation.final_amount;
          promoId = params.promo_code;
        } else {
          return {
            success: false,
            transaction_id: '',
            error: promoValidation.error || 'Invalid promo code',
          };
        }
      }

      // 3. Create transaction record (PENDING status)
      const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type: 'payment',
          status: 'pending',
          amount: finalAmount,
          booking_id: params.booking_id,
          payment_method: params.payment_method,
          description: params.description,
          metadata: {
            original_amount: params.amount,
            promo_code: promoId,
            gateway: this.config.gateway,
          },
        })
        .select()
        .single();

      if (txError || !transaction) {
        throw new Error('Failed to create transaction record');
      }

      // 4. Create payment intent with gateway
      const paymentIntent = await this.callPaymentGateway(
        transaction.id,
        finalAmount,
        params.payment_method,
        userId,
        params.description
      );

      if (!paymentIntent.success) {
        // Rollback transaction to failed
        await supabase
          .from('transactions')
          .update({ status: 'failed' })
          .eq('id', transaction.id);

        return paymentIntent;
      }

      // 5. Update transaction with gateway ID
      await supabase
        .from('transactions')
        .update({
          gateway_transaction_id: paymentIntent.gateway_id,
          metadata: {
            ...transaction.metadata,
            client_secret: paymentIntent.client_secret,
          },
        })
        .eq('id', transaction.id);

      return {
        success: true,
        transaction_id: transaction.id,
        gateway_id: paymentIntent.gateway_id,
        client_secret: paymentIntent.client_secret,
        redirect_url: paymentIntent.redirect_url,
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      return {
        success: false,
        transaction_id: '',
        error: error instanceof Error ? error.message : 'Payment initialization failed',
      };
    }
  }

  /**
   * Confirm payment after user completes gateway payment
   * This is called when payment gateway sends callback/webhook
   */
  async confirmPayment(
    transactionId: string,
    gatewayTransactionId: string,
    status: TransactionStatus
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // 1. Get transaction
      const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .select()
        .eq('id', transactionId)
        .single();

      if (txError || !transaction) {
        return { success: false, error: 'Transaction not found' };
      }

      if (status === 'completed') {
        // 2. Update transaction status
        await supabase
          .from('transactions')
          .update({
            status: 'completed',
            gateway_transaction_id: gatewayTransactionId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', transactionId);

        // 3. Update booking status
        await supabase
          .from('bookings')
          .update({ status: 'confirmed' })
          .eq('id', transaction.booking_id);

        // 4. Update wallet (debit amount)
        await this.updateWalletBalance(transaction.user_id, -transaction.amount);

        // 5. Create notification
        // NOTE: Implement notification service
        console.log('Payment confirmed for booking:', transaction.booking_id);

        return { success: true };
      } else if (status === 'failed') {
        // Mark transaction as failed
        await supabase
          .from('transactions')
          .update({ status: 'failed' })
          .eq('id', transactionId);

        return { success: false, error: 'Payment failed' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error confirming payment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Confirmation failed',
      };
    }
  }

  /**
   * Process refund with retry logic
   */
  async processRefund(refundRequest: RefundRequest): Promise<{ success: boolean; error?: string }> {
    try {
      // Get original transaction
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select('id, total_price')
        .eq('id', refundRequest.booking_id)
        .single();

      if (bookingError || !booking) {
        return { success: false, error: 'Booking not found' };
      }

      const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .select()
        .eq('booking_id', refundRequest.booking_id)
        .eq('type', 'payment')
        .eq('status', 'completed')
        .single();

      if (txError || !transaction) {
        return { success: false, error: 'Payment transaction not found' };
      }

      // Create refund record
      const { data: refund, error: refundError } = await supabase
        .from('refunds')
        .insert({
          transaction_id: transaction.id,
          booking_id: refundRequest.booking_id,
          reason: refundRequest.reason,
          status: 'pending',
          amount: booking.total_price,
          notes: refundRequest.notes,
        })
        .select()
        .single();

      if (refundError || !refund) {
        return { success: false, error: 'Failed to create refund record' };
      }

      // Process refund with retry logic
      const refundResult = await this.retryOperation(
        () => this.callRefundGateway(transaction.gateway_transaction_id, booking.total_price),
        this.retryConfig
      );

      if (!refundResult) {
        await supabase
          .from('refunds')
          .update({ status: 'failed' })
          .eq('id', refund.id);

        return { success: false, error: 'Refund processing failed' };
      }

      // Update refund status
      await supabase
        .from('refunds')
        .update({
          status: 'processed',
          processed_at: new Date().toISOString(),
        })
        .eq('id', refund.id);

      // Restore balance to user wallet
      await this.updateWalletBalance(transaction.user_id, booking.total_price);

      return { success: true };
    } catch (error) {
      console.error('Error processing refund:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Refund processing failed',
      };
    }
  }

  /**
   * Get user wallet balance
   */
  async getWallet(userId: string): Promise<Wallet | null> {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select()
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching wallet:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error getting wallet:', error);
      return null;
    }
  }

  /**
   * Update wallet balance with validation
   */
  private async updateWalletBalance(userId: string, amount: number): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('update_wallet_balance', {
        p_user_id: userId,
        p_amount: amount,
      });

      if (error) {
        console.error('Error updating wallet:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating wallet balance:', error);
      return false;
    }
  }

  /**
   * Validate promo code and calculate discount
   */
  private async validatePromo(code: string, amount: number): Promise<PromoValidation> {
    try {
      const { data: promo, error } = await supabase
        .from('promo_codes')
        .select()
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !promo) {
        return { valid: false, error: 'Promo code not found' };
      }

      // Check expiry
      if (new Date(promo.valid_until) < new Date()) {
        return { valid: false, error: 'Promo code expired' };
      }

      // Check min booking amount
      if (amount < promo.min_booking_amount) {
        return {
          valid: false,
          error: `Minimum booking amount: ${promo.min_booking_amount}`,
        };
      }

      // Check max uses
      if (promo.max_uses && promo.current_uses >= promo.max_uses) {
        return { valid: false, error: 'Promo code usage limit reached' };
      }

      // Calculate discount
      let discountAmount = 0;
      if (promo.discount_type === 'percentage') {
        discountAmount = (amount * promo.discount_value) / 100;
      } else {
        discountAmount = promo.discount_value;
      }

      return {
        valid: true,
        discount_amount: discountAmount,
        final_amount: Math.max(0, amount - discountAmount),
      };
    } catch (error) {
      console.error('Error validating promo:', error);
      return { valid: false, error: 'Validation failed' };
    }
  }

  /**
   * Call payment gateway (Midtrans, Stripe, etc.)
   * This is a stub - implement actual gateway integration
   */
  private async callPaymentGateway(
    transactionId: string,
    amount: number,
    method: PaymentMethod,
    userId: string,
    description: string
  ): Promise<{ success: boolean; gateway_id?: string; client_secret?: string; redirect_url?: string }> {
    try {
      // TODO: Implement actual payment gateway integration
      // For Midtrans: Use snap-token
      // For Stripe: Use PaymentIntent API

      // Mock implementation
      return {
        success: true,
        gateway_id: `mock_${transactionId}`,
        client_secret: `mock_secret_${transactionId}`,
      };
    } catch (error) {
      console.error('Error calling payment gateway:', error);
      return { success: false };
    }
  }

  /**
   * Call refund endpoint on payment gateway
   */
  private async callRefundGateway(
    gatewayTransactionId: string,
    amount: number
  ): Promise<boolean> {
    try {
      // TODO: Implement actual refund with gateway
      // For Midtrans: Use refund API
      // For Stripe: Use refund API
      console.log(`Refunding ${amount} for gateway transaction: ${gatewayTransactionId}`);
      return true;
    } catch (error) {
      console.error('Error calling refund gateway:', error);
      return false;
    }
  }

  /**
   * Retry operation with exponential backoff
   */
  private async retryOperation<T>(
    operation: () => Promise<T>,
    config: typeof this.retryConfig
  ): Promise<T | null> {
    for (let attempt = 0; attempt < config.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt < config.maxRetries - 1) {
          const delay = Math.min(
            config.baseDelay * Math.pow(2, attempt),
            config.maxDelay
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
    return null;
  }
}

// Export singleton instance
const paymentConfig: PaymentConfig = {
  gateway: (process.env.VITE_PAYMENT_GATEWAY as PaymentGateway) || 'midtrans',
  gatewayKey: process.env.VITE_PAYMENT_GATEWAY_KEY || '',
  currency: 'IDR',
  timeout: 30000,
};

export const paymentService = new PaymentService(paymentConfig);
