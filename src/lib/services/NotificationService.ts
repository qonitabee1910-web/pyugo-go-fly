/**
 * Notification Service
 * Multi-channel notification delivery (Push, SMS, In-app, Email)
 * Handles notification scheduling, delivery tracking, and preferences
 */

import { supabase } from '@/shared/integrations/supabase/client';
import {
  Notification,
  NotificationType,
  NotificationPayload,
  DeviceToken,
  DevicePlatform,
} from '@/lib/types/production';

interface NotificationConfig {
  fcmKey?: string; // Firebase Cloud Messaging
  twilioSid?: string; // SMS
  sendgridKey?: string; // Email
  enabled: boolean;
}

interface NotificationPreferences {
  push_enabled: boolean;
  sms_enabled: boolean;
  email_enabled: boolean;
  ride_notifications: boolean;
  promotional_notifications: boolean;
  quiet_hours_start?: string; // HH:mm format
  quiet_hours_end?: string;
}

interface NotificationTemplate {
  type: NotificationType;
  title_template: string;
  body_template: string;
  priority: 'high' | 'normal' | 'low';
}

class NotificationService {
  private config: NotificationConfig;
  private templates: Map<NotificationType, NotificationTemplate>;

  constructor(config: NotificationConfig) {
    this.config = config;
    this.templates = this.initializeTemplates();
  }

  /**
   * Send notification to user across multiple channels
   */
  async send(payload: NotificationPayload, userId?: string): Promise<{ success: boolean; errors?: string[] }> {
    try {
      const errors: string[] = [];

      // 1. Save notification to database
      const { data: notification, error: dbError } = await supabase
        .from('notifications')
        .insert({
          user_id: userId || payload.user_id,
          type: payload.type,
          title: payload.title,
          body: payload.body,
          data: payload.data,
        })
        .select()
        .single();

      if (dbError) {
        errors.push('Failed to save notification');
      }

      // 2. Get user preferences
      const preferences = await this.getUserPreferences(userId || payload.user_id!);
      if (!preferences) {
        errors.push('Could not retrieve user preferences');
      }

      // 3. Send through enabled channels
      if (preferences?.push_enabled) {
        const pushResult = await this.sendPushNotification(
          userId || payload.user_id!,
          payload.title,
          payload.body,
          payload.data
        );
        if (!pushResult) errors.push('Push notification failed');
      }

      if (preferences?.sms_enabled && this.isUrgentType(payload.type)) {
        const smsResult = await this.sendSMS(userId || payload.user_id!, payload.body);
        if (!smsResult) errors.push('SMS notification failed');
      }

      if (preferences?.email_enabled && this.isEmailWorthyType(payload.type)) {
        const emailResult = await this.sendEmail(
          userId || payload.user_id!,
          payload.title,
          payload.body
        );
        if (!emailResult) errors.push('Email notification failed');
      }

      return {
        success: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined,
      };
    } catch (error) {
      console.error('Error sending notification:', error);
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Notification sending failed'],
      };
    }
  }

  /**
   * Broadcast to all active drivers
   * Used for surge pricing alerts, demand updates
   */
  async broadcastToDrivers(
    message: string,
    data?: Record<string, any>
  ): Promise<{ success: boolean; sent_count: number }> {
    try {
      // Get all active driver tokens
      const { data: tokens, error } = await supabase
        .from('device_tokens')
        .select('user_id, token')
        .eq('is_active', true);

      if (error || !tokens) {
        console.error('Error fetching driver tokens:', error);
        return { success: false, sent_count: 0 };
      }

      // Send to each driver
      let sentCount = 0;
      for (const { token } of tokens) {
        const result = await this.sendToDevice(token, 'system_alert', message, data);
        if (result) sentCount++;
      }

      return { success: true, sent_count: sentCount };
    } catch (error) {
      console.error('Error broadcasting to drivers:', error);
      return { success: false, sent_count: 0 };
    }
  }

  /**
   * Register device token for push notifications
   */
  async registerDeviceToken(
    userId: string,
    token: string,
    platform: DevicePlatform
  ): Promise<boolean> {
    try {
      const { error } = await supabase.from('device_tokens').upsert(
        {
          user_id: userId,
          token,
          platform,
          is_active: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,token' }
      );

      if (error) {
        console.error('Error registering device token:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error registering device token:', error);
      return false;
    }
  }

  /**
   * Unregister device token
   */
  async unregisterDeviceToken(userId: string, token: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('device_tokens')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('token', token);

      if (error) {
        console.error('Error unregistering device token:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error unregistering device token:', error);
      return false;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  /**
   * Get unread notifications count
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('Error getting unread count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          notification_preferences: preferences,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating preferences:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating preferences:', error);
      return false;
    }
  }

  /**
   * Send push notification via Firebase Cloud Messaging
   */
  private async sendPushNotification(
    userId: string,
    title: string,
    body: string,
    data?: Record<string, any>
  ): Promise<boolean> {
    try {
      // Get device tokens
      const { data: tokens, error } = await supabase
        .from('device_tokens')
        .select('token')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error || !tokens || tokens.length === 0) {
        console.warn('No active device tokens found');
        return false;
      }

      // Send to each device
      for (const { token } of tokens) {
        await this.sendToDevice(token, 'notification', title, { body, ...data });
      }

      return true;
    } catch (error) {
      console.error('Error sending push notification:', error);
      return false;
    }
  }

  /**
   * Send to specific device
   * This is a stub - implement with Firebase SDK
   */
  private async sendToDevice(
    token: string,
    type: string,
    title: string,
    data?: Record<string, any>
  ): Promise<boolean> {
    try {
      // TODO: Implement Firebase Cloud Messaging
      // For now, just log
      console.log(`Sending ${type} to device:`, token, title);
      return true;
    } catch (error) {
      console.error('Error sending to device:', error);
      return false;
    }
  }

  /**
   * Send SMS notification
   * Stub - implement with Twilio
   */
  private async sendSMS(userId: string, message: string): Promise<boolean> {
    try {
      // Get user phone number
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('phone')
        .eq('id', userId)
        .single();

      if (error || !profile?.phone) {
        console.warn('Phone number not found for user:', userId);
        return false;
      }

      // TODO: Implement Twilio SMS sending
      console.log(`Sending SMS to ${profile.phone}:`, message);
      return true;
    } catch (error) {
      console.error('Error sending SMS:', error);
      return false;
    }
  }

  /**
   * Send email notification
   * Stub - implement with SendGrid
   */
  private async sendEmail(
    userId: string,
    subject: string,
    body: string
  ): Promise<boolean> {
    try {
      // Get user email
      const { data: user, error } = await supabase.auth.admin.getUserById(userId);

      if (error || !user?.user?.email) {
        console.warn('Email not found for user:', userId);
        return false;
      }

      // TODO: Implement SendGrid email sending
      console.log(`Sending email to ${user.user.email}:`, subject);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  /**
   * Get user notification preferences
   */
  private async getUserPreferences(
    userId: string
  ): Promise<NotificationPreferences | null> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('notification_preferences')
        .eq('id', userId)
        .single();

      if (error) {
        return this.getDefaultPreferences();
      }

      return profile?.notification_preferences || this.getDefaultPreferences();
    } catch (error) {
      console.error('Error getting preferences:', error);
      return this.getDefaultPreferences();
    }
  }

  /**
   * Get default notification preferences
   */
  private getDefaultPreferences(): NotificationPreferences {
    return {
      push_enabled: true,
      sms_enabled: false,
      email_enabled: true,
      ride_notifications: true,
      promotional_notifications: true,
    };
  }

  /**
   * Check if notification type is urgent (should send SMS)
   */
  private isUrgentType(type: NotificationType): boolean {
    return ['ride_accepted', 'driver_arriving', 'payment_failed'].includes(type);
  }

  /**
   * Check if notification type warrants email
   */
  private isEmailWorthyType(type: NotificationType): boolean {
    return ['ride_completed', 'payment_confirmed', 'refund_processed'].includes(type);
  }

  /**
   * Initialize notification templates
   */
  private initializeTemplates(): Map<NotificationType, NotificationTemplate> {
    return new Map([
      [
        'ride_accepted',
        {
          type: 'ride_accepted',
          title_template: 'Ride Accepted!',
          body_template: 'Driver {driver_name} accepted your ride',
          priority: 'high',
        },
      ],
      [
        'driver_arriving',
        {
          type: 'driver_arriving',
          title_template: 'Driver Arriving',
          body_template: 'Your driver is {minutes} minutes away',
          priority: 'high',
        },
      ],
      [
        'ride_completed',
        {
          type: 'ride_completed',
          title_template: 'Ride Completed',
          body_template: 'Trip to {destination} completed. Amount: {amount}',
          priority: 'normal',
        },
      ],
      [
        'payment_confirmed',
        {
          type: 'payment_confirmed',
          title_template: 'Payment Confirmed',
          body_template: 'Payment of {amount} confirmed',
          priority: 'normal',
        },
      ],
      [
        'refund_processed',
        {
          type: 'refund_processed',
          title_template: 'Refund Processed',
          body_template: 'Refund of {amount} processed to your wallet',
          priority: 'normal',
        },
      ],
    ]);
  }
}

// Export singleton instance
const notificationConfig: NotificationConfig = {
  fcmKey: process.env.VITE_FCM_KEY,
  twilioSid: process.env.VITE_TWILIO_SID,
  sendgridKey: process.env.VITE_SENDGRID_KEY,
  enabled: true,
};

export const notificationService = new NotificationService(notificationConfig);
