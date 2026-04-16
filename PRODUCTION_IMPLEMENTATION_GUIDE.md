# PYU-GO Production Implementation Guide

**Comprehensive guide for integrating all production services into the ride-hailing platform.**

---

## 🎯 Quick Start

### Step 1: Set Environment Variables

```bash
# .env.local

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Payment Gateway (Midtrans or Stripe)
VITE_PAYMENT_GATEWAY=midtrans  # or stripe
VITE_PAYMENT_GATEWAY_KEY=your-payment-key

# Notifications
VITE_FCM_KEY=your-firebase-key
VITE_TWILIO_SID=your-twilio-sid
VITE_TWILIO_AUTH_TOKEN=your-twilio-token
VITE_SENDGRID_KEY=your-sendgrid-key

# Analytics (optional)
VITE_ANALYTICS_KEY=your-analytics-key
```

### Step 2: Run Database Migrations

```bash
# Push the new schema to Supabase
supabase db push

# Run migrations
supabase migration list
```

### Step 3: Import Services

```typescript
import {
  paymentService,
  notificationService,
  analyticsService,
  ratingService,
  supportService,
  advancedDispatchService,
} from '@/lib/services';
```

---

## 📋 Integration Patterns

### 1. Payment Flow Integration

#### In RideBook Component:

```typescript
import { paymentService } from '@/lib/services';

export function RideBook({ bookingId, userId }: Props) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async (paymentMethod: 'card' | 'ewallet') => {
    try {
      setLoading(true);

      // 1. Create payment intent
      const result = await paymentService.createPaymentIntent(
        {
          booking_id: bookingId,
          amount: totalFare,
          payment_method: paymentMethod,
          promo_code: appliedPromo?.code,
          description: `Ride to ${destination}`,
        },
        userId
      );

      if (!result.success) {
        toast({
          title: 'Payment Failed',
          description: result.error,
          variant: 'destructive',
        });
        return;
      }

      // 2. Redirect to payment gateway
      if (result.redirect_url) {
        window.location.href = result.redirect_url;
      }

      // 3. Store transaction ID for later confirmation
      localStorage.setItem('pending_transaction', result.transaction_id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => handlePayment('card')}>Pay with Card</button>
      <button onClick={() => handlePayment('ewallet')}>Pay with E-Wallet</button>
    </div>
  );
}
```

#### Payment Gateway Callback Handler:

```typescript
// Create a route handler or webhook endpoint
export async function handlePaymentCallback(req: Request) {
  const { transaction_id, gateway_transaction_id, status } = await req.json();

  const result = await paymentService.confirmPayment(
    transaction_id,
    gateway_transaction_id,
    status as TransactionStatus
  );

  if (result.success) {
    // Clear pending transaction
    localStorage.removeItem('pending_transaction');
    // Redirect to success page
    window.location.href = '/ride/status/' + bookingId;
  }
}
```

---

### 2. Notification Integration

#### Register Device Token on App Load:

```typescript
import { notificationService } from '@/lib/services';
import { useEffect } from 'react';

export function App() {
  useEffect(() => {
    const registerNotifications = async () => {
      // Request permission and get token
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            // Generate or get FCM token
            const token = await getFirebaseToken(); // Implement this
            
            const user = await supabase.auth.getUser();
            if (user.data.user) {
              await notificationService.registerDeviceToken(
                user.data.user.id,
                token,
                'web'
              );
            }
          }
        } catch (error) {
          console.error('Error registering notifications:', error);
        }
      }
    };

    registerNotifications();
  }, []);
}
```

#### Send Notification on Ride Events:

```typescript
import { notificationService } from '@/lib/services';

export async function handleRideAccepted(booking, driver) {
  // Notify user that ride was accepted
  await notificationService.send(
    {
      type: 'ride_accepted',
      title: 'Ride Accepted!',
      body: `${driver.name} accepted your ride with ${driver.vehicle}`,
      data: {
        booking_id: booking.id,
        driver_id: driver.id,
        driver_location: driver.location,
      },
    },
    booking.user_id
  );

  // Notify driver that user confirmed
  await notificationService.send(
    {
      type: 'driver_alert',
      title: 'Ride Confirmed',
      body: `Heading to pickup at ${booking.pickup_address}`,
      data: { booking_id: booking.id },
    },
    driver.user_id
  );
}
```

#### Broadcast Message to All Drivers:

```typescript
// During surge pricing event
await notificationService.broadcastToDrivers(
  'Surge pricing active! 1.5x multiplier in your area',
  {
    event_type: 'surge_alert',
    surge_multiplier: 1.5,
    valid_until: new Date(Date.now() + 3600000).toISOString(),
  }
);
```

---

### 3. Analytics Integration

#### Track Ride Completion:

```typescript
import { analyticsService } from '@/lib/services';

export async function completeRide(booking: Booking) {
  const distance = calculateDistance(pickup, destination);
  const duration = calculateDuration(startTime, endTime);

  // Track ride completion
  await analyticsService.trackRideCompletion(
    booking.user_id,
    booking.id,
    distance,
    duration,
    booking.total_price
  );

  // Track in analytics
  await analyticsService.trackEvent('trip_completed', {
    booking_id: booking.id,
    service_type: booking.service_type,
    distance_km: distance,
    duration_minutes: duration,
  });
}
```

#### Track User Actions:

```typescript
// When user searches for rides
await analyticsService.trackEvent('search_initiated', {
  origin: pickupLocation,
  destination: destinationLocation,
}, userId);

// When user confirms booking
await analyticsService.trackEvent('booking_confirmed', {
  booking_id: booking.id,
  estimated_fare: estimatedFare,
}, userId);

// When error occurs (for debugging)
await analyticsService.trackError(
  'Payment gateway timeout',
  'PAYMENT_TIMEOUT',
  userId,
  { gateway: 'midtrans', timeout_ms: 30000 }
);
```

#### View User Statistics:

```typescript
import { analyticsService } from '@/lib/services';
import { useEffect, useState } from 'react';

export function UserProfile({ userId }: Props) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      const userStats = await analyticsService.getUserStatistics(userId);
      setStats(userStats);
    };

    loadStats();
  }, [userId]);

  if (!stats) return <div>Loading...</div>;

  return (
    <div>
      <p>Total Rides: {stats.total_rides}</p>
      <p>Total Spent: IDR {stats.total_spent.toLocaleString()}</p>
      <p>Average Rating: {stats.average_rating}/5 ({stats.total_ratings} ratings)</p>
    </div>
  );
}
```

---

### 4. Rating Integration

#### Submit Rating After Ride:

```typescript
import { ratingService } from '@/lib/services';

export function RideRatingModal({ booking, onClose }: Props) {
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    const success = await ratingService.submitRating(
      booking.id,
      userId, // current user
      booking.driver_id,
      rating,
      comment
    );

    if (success) {
      toast({ title: 'Rating submitted!' });
      onClose();
    }
  };

  return (
    <dialog>
      <h2>Rate Your Driver</h2>
      <StarRating value={rating} onChange={setRating} />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Optional comment"
      />
      <button onClick={handleSubmit}>Submit Rating</button>
    </dialog>
  );
}
```

#### Display Driver Ratings:

```typescript
import { ratingService } from '@/lib/services';

export function DriverProfile({ driverId }: Props) {
  const [ratingStats, setRatingStats] = useState(null);

  useEffect(() => {
    const loadRatings = async () => {
      const stats = await ratingService.getDriverRatingStats(driverId);
      setRatingStats(stats);
    };

    loadRatings();
  }, [driverId]);

  if (!ratingStats) return <div>Loading...</div>;

  return (
    <div>
      <div>
        <span className="text-2xl font-bold">{ratingStats.average_rating}</span>
        <span> / 5</span>
        <span className="ml-2 text-gray-500">({ratingStats.total_ratings} ratings)</span>
      </div>

      {/* Rating distribution bar */}
      <div className="mt-4 space-y-2">
        {[5, 4, 3, 2, 1].map((stars) => (
          <div key={stars} className="flex items-center gap-2">
            <span className="w-8">{stars}★</span>
            <div className="flex-1 bg-gray-200 rounded h-2">
              <div
                className="bg-yellow-400 h-2 rounded"
                style={{
                  width: `${(ratingStats.distribution[stars as keyof typeof ratingStats.distribution] / ratingStats.total_ratings) * 100}%`,
                }}
              />
            </div>
            <span className="w-12 text-right text-sm">
              {ratingStats.distribution[stars as keyof typeof ratingStats.distribution]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 5. Support System Integration

#### Create Support Ticket:

```typescript
import { supportService } from '@/lib/services';

export function SupportForm({ bookingId, userId }: Props) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    const result = await supportService.createTicket(userId, {
      booking_id: bookingId,
      subject,
      description,
      priority: 'high',
    });

    if (result.success) {
      toast({
        title: 'Ticket Created',
        description: `Ticket ID: ${result.ticket_id}`,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe your issue"
      />
      <button type="submit">Submit</button>
    </form>
  );
}
```

#### View Support Tickets:

```typescript
export function SupportTickets({ userId }: Props) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  useEffect(() => {
    const loadTickets = async () => {
      const userTickets = await supportService.getUserTickets(userId);
      setTickets(userTickets);
    };

    loadTickets();
  }, [userId]);

  return (
    <div>
      {tickets.map((ticket) => (
        <div key={ticket.id} className="p-4 border rounded">
          <h3>{ticket.subject}</h3>
          <p className="text-gray-600">{ticket.description}</p>
          <span className={`badge badge-${ticket.status}`}>
            {ticket.status}
          </span>
          {ticket.resolution_notes && (
            <p className="mt-2 text-green-600">{ticket.resolution_notes}</p>
          )}
        </div>
      ))}
    </div>
  );
}
```

---

### 6. Advanced Dispatch Integration

#### Find Optimal Drivers:

```typescript
import { advancedDispatchService } from '@/lib/services';

export async function requestRide(
  userId: string,
  pickupLocation: Location,
  destination: Location,
  serviceType: string
) {
  // Find optimal drivers using ML scoring
  const candidates = await advancedDispatchService.findOptimalDrivers({
    user_lat: pickupLocation.latitude,
    user_lng: pickupLocation.longitude,
    destination_lat: destination.latitude,
    destination_lng: destination.longitude,
    service_type: serviceType,
  });

  if (candidates.length === 0) {
    // Adaptive dispatch with wider radius
    const driver = await advancedDispatchService.adaptiveDispatch({
      user_lat: pickupLocation.latitude,
      user_lng: pickupLocation.longitude,
      destination_lat: destination.latitude,
      destination_lng: destination.longitude,
      service_type: serviceType,
    });

    if (!driver) {
      throw new Error('No drivers available in your area');
    }
  }

  // Send offers to candidates
  for (const candidate of candidates) {
    await sendDispatchOffer(candidate.driver_id, {
      booking_id: bookingId,
      fare_estimate: candidate.fare_estimate,
      eta_minutes: candidate.eta_minutes,
    });
  }
}
```

---

## 🔧 Configuration & Customization

### Tune Dispatch ML Weights

Edit `SupportService.ts` → `scoreDriver()`:

```typescript
const weights = {
  proximity: 0.35,      // Increase for location priority
  rating: 0.25,         // Quality preference
  acceptance: 0.25,     // Reliability
  online: 0.15,         // Online status
};
```

### Customize Surge Pricing

Edit `config.ts`:

```typescript
export const SURGE_PRICING = {
  peak_hours: {
    times: ['07:00-09:00', '17:00-19:00'],
    multiplier: 1.5,
  },
  night_hours: {
    times: ['22:00-05:00'],
    multiplier: 1.2,
  },
  weekend_surge: {
    after_7pm: 1.3,
  },
};
```

### Adjust Rate Limiting

Edit `validation.ts` → `RateLimiter`:

```typescript
// Default: 5 attempts per 60 seconds
const limiter = new RateLimiter(5, 60000);

// Change to 10 attempts per 2 minutes
const limiter = new RateLimiter(10, 120000);
```

---

## 📊 Monitoring & Debugging

### Check Service Health

```typescript
// Create health check endpoint
export async function healthCheck() {
  const checks = {
    payment: await paymentService.getWallet('test-user'),
    notifications: await notificationService.getUnreadCount('test-user'),
    database: await supabase.from('profiles').select('count').single(),
  };

  return Object.fromEntries(
    Object.entries(checks).map(([key, result]) => [
      key,
      result ? 'OK' : 'FAILED',
    ])
  );
}
```

### Enable Debug Logging

```typescript
// Add to services for verbose logging
const DEBUG = true;

function log(message: string, data?: any) {
  if (DEBUG) {
    console.log(`[Service] ${message}`, data);
  }
}
```

---

## 🚀 Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Payment gateway keys validated
- [ ] Firebase Cloud Messaging configured
- [ ] Twilio SMS account setup
- [ ] SendGrid email account setup
- [ ] Analytics platform connected
- [ ] Error tracking (Sentry) configured
- [ ] SSL certificates valid
- [ ] Database backups automated
- [ ] Monitoring alerts setup
- [ ] Rate limiting configured
- [ ] RLS policies verified
- [ ] Load testing completed
- [ ] Staging deployment successful

---

## 📞 Support

For integration support:
1. Check `PRODUCTION_ARCHITECTURE.md` for system design
2. Review service type definitions in `production.ts`
3. Reference service index in `services/index.ts`
4. Check error logs for detailed debugging info

---

**Production-ready implementation complete!** 🎉
