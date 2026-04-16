# PYU-GO Admin Dashboard Infrastructure

**Complete admin panel architecture for platform management, monitoring, and decision-making.**

---

## 📊 Admin Dashboard Overview

### Core Modules

#### 1. **Dashboard** (Home)
- Real-time key metrics
- Revenue graph
- Active users/drivers
- Recent transactions

#### 2. **Users Management**
- User list with search/filter
- User details & history
- Suspend/ban users
- View wallet balance
- Manual refunds

#### 3. **Drivers Management**
- Driver verification workflow
- Performance metrics
- Rating reports
- Suspension management
- Document verification (KYC)

#### 4. **Bookings & Orders**
- All bookings search
- Order status tracking
- Refund management
- Dispute resolution

#### 5. **Financial Management**
- Transaction logs
- Revenue analytics
- Commission tracking
- Payment gateway reconciliation

#### 6. **Support & Tickets**
- Support ticket queue
- Ticket assignment
- Resolution tracking
- Customer feedback

#### 7. **Promotions & Promos**
- Create/manage promo codes
- Campaign tracking
- Usage analytics

#### 8. **Analytics & Reports**
- User growth metrics
- Revenue trends
- Operational metrics
- Custom reports

#### 9. **System Settings**
- Feature flags
- Rate limiting config
- Surge pricing settings
- Emergency alerts

---

## 🏗️ Admin Frontend Architecture

```
admin/
├── Dashboard/
│   ├── Overview.tsx        # KPI cards, charts
│   ├── RevenueChart.tsx    # Revenue trends
│   ├── UserMetrics.tsx     # Active users graph
│   └── Alerts.tsx          # Critical alerts
│
├── Users/
│   ├── UserList.tsx        # Table with pagination
│   ├── UserDetail.tsx      # Individual user info
│   ├── UserActions.tsx     # Ban, refund, etc.
│   └── SearchFilter.tsx    # Advanced search
│
├── Drivers/
│   ├── DriverList.tsx      # All drivers table
│   ├── DriverDetail.tsx    # Driver KYC verification
│   ├── VerificationQueue.tsx
│   ├── PerformanceMetrics.tsx
│   └── Suspension.tsx      # Ban/suspend drivers
│
├── Bookings/
│   ├── BookingList.tsx     # All bookings
│   ├── BookingDetail.tsx   # Booking info
│   ├── RefundManager.tsx   # Process refunds
│   └── DisputeResolver.tsx # Handle disputes
│
├── Financial/
│   ├── Transactions.tsx    # Transaction log
│   ├── RevenueDashboard.tsx
│   ├── CommissionTracking.tsx
│   └── PaymentReconciliation.tsx
│
├── Support/
│   ├── TicketQueue.tsx     # Open tickets
│   ├── TicketDetail.tsx    # Individual ticket
│   ├── TicketResolver.tsx  # Resolve ticket
│   └── FeedbackAnalysis.tsx
│
├── Promos/
│   ├── PromoList.tsx       # Active promos
│   ├── CreatePromo.tsx     # Create new promo
│   ├── PromoStats.tsx      # Promo performance
│   └── CampaignManagement.tsx
│
├── Analytics/
│   ├── CustomReports.tsx   # Build reports
│   ├── Funnels.tsx         # Conversion funnels
│   ├── Retention.tsx       # Retention analysis
│   └── ExportData.tsx      # Data export
│
├── Settings/
│   ├── FeatureFlags.tsx    # Feature toggles
│   ├── RateLimiting.tsx    # Rate limit config
│   ├── SurgePricing.tsx    # Pricing config
│   ├── AlertRules.tsx      # Alert configuration
│   └── SystemStatus.tsx    # System health
│
└── Shared/
    ├── AdminLayout.tsx     # Main layout
    ├── Sidebar.tsx         # Navigation
    ├── AdminGuard.tsx      # Permission check
    └── AuditLog.tsx        # All admin actions
```

---

## 🔐 Admin Authorization

### Role-Based Access Control (RBAC)

```sql
-- Admin roles table
CREATE TABLE admin_roles (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES auth.users ON DELETE CASCADE,
  role ENUM ('super_admin', 'admin', 'moderator', 'support', 'finance', 'analyst'),
  permissions JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Example permissions structure
{
  "users": {
    "view": true,
    "edit": true,
    "suspend": true,
    "refund": true
  },
  "drivers": {
    "verify": true,
    "suspend": true,
    "view": true
  },
  "financial": {
    "view": true,
    "reconcile": false
  },
  "support": {
    "resolve_tickets": true,
    "view_feedback": true
  }
}
```

### Permission Checking Hook

```typescript
// hooks/useAdminPermission.ts
export function useAdminPermission(resource: string, action: string): boolean {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!user) return;

    const fetchPermissions = async () => {
      const { data } = await supabase
        .from('admin_roles')
        .select('permissions')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setPermissions(data.permissions);
      }
    };

    fetchPermissions();
  }, [user]);

  return permissions?.[resource]?.[action] ?? false;
}
```

---

## 📈 Admin Service Layer

```typescript
// services/AdminService.ts

class AdminService {
  /**
   * Get dashboard KPIs
   */
  async getDashboardMetrics() {
    const today = new Date().toISOString().split('T')[0];
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const metrics = {
      today: {
        rides: await this.countBookings(today),
        revenue: await this.calculateRevenue(today),
        new_users: await this.countNewUsers(today),
        active_drivers: await this.countActiveDrivers(),
      },
      month: {
        rides: await this.countBookings(last30Days),
        revenue: await this.calculateRevenue(last30Days),
        new_users: await this.countNewUsers(last30Days),
        avg_rating: await this.calculateAverageRating(),
      },
      alerts: await this.getSystemAlerts(),
    };

    return metrics;
  }

  /**
   * Suspend user account
   */
  async suspendUser(userId: string, reason: string, durationDays?: number) {
    await supabase
      .from('profiles')
      .update({
        suspended_until: durationDays
          ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString()
          : null,
        suspension_reason: reason,
      })
      .eq('id', userId);

    // Log action
    await this.logAdminAction('user_suspended', userId, { reason, durationDays });
  }

  /**
   * Process manual refund
   */
  async processManualRefund(
    bookingId: string,
    amount: number,
    reason: string,
    adminId: string
  ) {
    // Create refund record
    const { data: refund } = await supabase
      .from('refunds')
      .insert({
        booking_id: bookingId,
        reason: 'support_override',
        amount,
        status: 'approved',
        notes: `Manual refund by admin: ${reason}`,
      })
      .select()
      .single();

    // Process payment
    await paymentService.processRefund({
      booking_id: bookingId,
      reason: 'support_override',
      notes: reason,
    });

    // Log action
    await this.logAdminAction('manual_refund', bookingId, {
      amount,
      reason,
      admin_id: adminId,
    });
  }

  /**
   * Verify driver documents
   */
  async verifyDriver(
    driverId: string,
    approved: boolean,
    notes?: string,
    adminId?: string
  ) {
    const status = approved ? 'verified' : 'rejected';

    await supabase
      .from('driver_profiles')
      .update({
        status,
        verified_at: approved ? new Date().toISOString() : null,
      })
      .eq('user_id', driverId);

    // Send notification to driver
    await notificationService.send({
      type: 'system_alert',
      title: approved ? 'Verification Approved' : 'Verification Rejected',
      body: notes || 'Your documents have been reviewed by our team.',
      data: { status },
    }, driverId);

    // Log action
    await this.logAdminAction('driver_verification', driverId, {
      approved,
      notes,
      admin_id: adminId,
    });
  }

  /**
   * Create system alert for all users
   */
  async broadcastAlert(title: string, message: string, severity: 'low' | 'medium' | 'high') {
    // Send to all users
    const { data: users } = await supabase
      .from('profiles')
      .select('id');

    for (const user of users || []) {
      await notificationService.send({
        type: 'system_alert',
        title,
        body: message,
        data: { severity },
      }, user.id);
    }

    // Store alert in database
    await supabase.from('system_alerts').insert({
      title,
      message,
      severity,
      created_at: new Date().toISOString(),
    });
  }

  /**
   * Export data to CSV
   */
  async exportData(
    dataType: 'users' | 'drivers' | 'bookings' | 'transactions',
    filters?: Record<string, any>
  ): Promise<Blob> {
    let query = supabase.from(dataType + 's').select();

    // Apply filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    const { data } = await query;

    // Convert to CSV
    const csv = this.convertToCSV(data || []);
    return new Blob([csv], { type: 'text/csv' });
  }

  /**
   * Log all admin actions for audit trail
   */
  private async logAdminAction(
    action: string,
    target_id: string,
    details: Record<string, any>
  ) {
    await supabase.from('admin_audit_log').insert({
      action,
      target_id,
      details,
      created_at: new Date().toISOString(),
    });
  }

  // Helper methods...
  private async countBookings(since: string): Promise<number> {
    const { count } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', since);

    return count || 0;
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map((row) =>
      Object.values(row)
        .map((val) => `"${val}"`)
        .join(',')
    );

    return [headers, ...rows].join('\n');
  }
}

export const adminService = new AdminService();
```

---

## 📋 Key Admin Features

### 1. Real-Time Monitoring
- Live ride count
- Active drivers map
- Payment status
- System health

### 2. User Management
- Search & filter
- View history
- Manual actions (refund, suspend)
- Bulk operations

### 3. Financial Controls
- Revenue tracking
- Commission management
- Dispute resolution
- Reconciliation

### 4. Fraud Detection
- Suspicious rating patterns
- Refund abuse detection
- Duplicate booking detection
- Unusual payment patterns

### 5. Analytics & Reporting
- Custom date ranges
- Segmentation
- Funnel analysis
- Export capabilities

### 6. Audit Trail
- All admin actions logged
- Timestamp & admin ID
- Change history
- Compliance reports

---

## 🔧 Deployment

### Admin Panel Routes

```typescript
// routes/admin.tsx
export const adminRoutes = [
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'users', element: <Users /> },
      { path: 'drivers', element: <Drivers /> },
      { path: 'bookings', element: <Bookings /> },
      { path: 'financial', element: <Financial /> },
      { path: 'support', element: <Support /> },
      { path: 'promos', element: <Promos /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
];
```

### Access Control

```typescript
// Middleware
export function AdminGuard({ children }: Props) {
  const { user } = useAuth();
  const hasAccess = useAdminPermission('admin', 'access');

  if (!user || !hasAccess) {
    return <Navigate to="/login" />;
  }

  return children;
}
```

---

## 📊 Success Metrics

- Dashboard load time: < 2 seconds
- Report generation: < 5 seconds
- Export time: < 30 seconds for 10K records
- All admin actions logged & auditable
- 99.9% uptime for critical admin features

---

**Admin infrastructure ready for enterprise operations!** 🎯
