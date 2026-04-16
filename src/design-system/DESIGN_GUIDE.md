/**
 * PYU-GO Design System Guide
 * 
 * Complete reference for using the design system
 * Includes tokens, patterns, and best practices
 */

// =============================================
// DESIGN SYSTEM DOCUMENTATION
// =============================================

/**
 * ## PYU-GO DESIGN SYSTEM
 * 
 * A modern, premium UI system built for super app "PYU-GO"
 * Inspired by industry leaders: Gojek, Grab, Traveloka, AirAsia
 * 
 * ### Key Principles
 * 
 * 1. **Minimalist but not empty** - Clear information hierarchy with proper spacing
 * 2. **Mobile-first** - Optimized for thumb interaction, scales to desktop
 * 3. **Accessibility** - WCAG 2.1 AA compliant, proper contrast ratios
 * 4. **Consistency** - Unified visual language across all screens
 * 5. **Performance** - Smooth animations (200-300ms), fast perception
 * 
 * ### Core Components
 * 
 * - Buttons (primary, secondary, outline, ghost, danger)
 * - Cards (elevated, outlined, ghost)
 * - Forms (inputs, selects, checkboxes, radio buttons)
 * - Navigation (top nav, bottom nav, breadcrumbs)
 * - Modals (full-screen, center, bottom sheet)
 * - Alerts & Notifications
 * - Lists & Grids
 * - Avatars & Badges
 * - Loading States (skeleton, shimmer, spinner)
 * 
 * ### Token Categories
 * 
 * 1. **Colors** - 50+ colors across primary, neutral, semantic
 * 2. **Spacing** - 8px grid system (0-96px)
 * 3. **Typography** - 6-level heading scale + body text variants
 * 4. **Shadows** - 5 levels + elevation shadows
 * 5. **Border Radius** - 0-24px + full
 * 6. **Transitions** - fast (150ms), base (200ms), slow (300ms)
 * 
 * =============================================
 * USAGE EXAMPLES
 * =============================================
 * 
 * ### Example 1: Primary Button
 * 
 * ```tsx
 * <button className={`${ComponentStyles.button.base} ${ComponentStyles.button.primary} ${ComponentStyles.button.md}`}>
 *   Pesan Sekarang
 * </button>
 * ```
 * 
 * ### Example 2: Card with Content
 * 
 * ```tsx
 * <div className={ComponentStyles.card.base}>
 *   <h3 className={ComponentStyles.typography.h3}>Judul Kartu</h3>
 *   <p className={ComponentStyles.typography.bodySmall}>Deskripsi konten</p>
 * </div>
 * ```
 * 
 * ### Example 3: Input Field with Label & Error
 * 
 * ```tsx
 * <div className={PATTERNS.inputGroup}>
 *   <label className={PATTERNS.inputLabel}>Email Address</label>
 *   <input 
 *     className={`${ComponentStyles.input.base} ${ComponentStyles.input.focus}`}
 *     type="email"
 *     placeholder="your@email.com"
 *   />
 *   {error && <span className={PATTERNS.inputError}>{error}</span>}
 * </div>
 * ```
 * 
 * ### Example 4: Badge Component
 * 
 * ```tsx
 * <span className={`${ComponentStyles.badge.base} ${ComponentStyles.badge.success}`}>
 *   Berhasil
 * </span>
 * ```
 * 
 * ### Example 5: Alert Message
 * 
 * ```tsx
 * <div className={`${ComponentStyles.alert.base} ${ComponentStyles.alert.info}`}>
 *   <AlertCircle size={20} className="flex-shrink-0" />
 *   <p>Informasi penting untuk pengguna</p>
 * </div>
 * ```
 * 
 * ### Example 6: Full-Width CTA Section
 * 
 * ```tsx
 * <div className={PATTERNS.pageContainer}>
 *   <div className={PATTERNS.responsivePadding}>
 *     <h1 className={ComponentStyles.typography.h1}>Selamat Datang</h1>
 *     <p className={ComponentStyles.typography.body}>Konten utama</p>
 *   </div>
 *   <button className={PATTERNS.primaryCTA}>Mulai Sekarang</button>
 * </div>
 * ```
 * 
 * =============================================
 * COLOR USAGE GUIDELINES
 * =============================================
 * 
 * ### Primary Color (Blue)
 * - Use for: CTAs, links, active states, important UI
 * - Palette: primary.50 to primary.900
 * - Example: buttons, selected tabs, active navigation
 * 
 * ### Success Color (Green)
 * - Use for: confirmations, completed actions, positive feedback
 * - Example: success badge, check icon, transaction completed
 * 
 * ### Warning Color (Amber/Yellow)
 * - Use for: alerts, cautions, pending states
 * - Example: warning badge, pending payment
 * 
 * ### Error Color (Red)
 * - Use for: errors, destructive actions, warnings
 * - Example: delete button, error message, validation errors
 * 
 * ### Neutral Color (Gray)
 * - Use for: text, backgrounds, borders, secondary actions
 * - neutral.900: primary text
 * - neutral.700: secondary text
 * - neutral.500: muted text
 * - neutral.100: light backgrounds
 * - neutral.0: white (cards, surfaces)
 * 
 * =============================================
 * TYPOGRAPHY USAGE GUIDELINES
 * =============================================
 * 
 * ### Hierarchy
 * 
 * - **h1** (32px, bold) - Page title
 * - **h2** (24px, bold) - Section title
 * - **h3** (20px, semibold) - Subsection
 * - **h4** (18px, semibold) - Card title
 * - **body** (16px) - Main content, descriptions
 * - **bodySmall** (14px) - Secondary text
 * - **label** (12px, uppercase) - Form labels, captions
 * - **caption** (12px) - Metadata, timestamps
 * 
 * ### Line Height
 * - Headings: tight (1.2-1.25)
 * - Body: relaxed (1.5-1.6)
 * - Ensures readability and visual hierarchy
 * 
 * =============================================
 * SPACING GUIDELINES (8px Grid)
 * =============================================
 * 
 * - **4px** - Icon spacing, tight elements
 * - **8px** - Element padding, small gaps
 * - **12px** - Section padding, moderate gaps
 * - **16px** - Component padding, standard gaps
 * - **24px** - Section spacing, large gaps
 * - **32px** - Large components, significant spacing
 * - **48px+** - Page-level spacing
 * 
 * ### Examples
 * - Card padding: 16px or 24px
 * - Button padding: 12px (vertical) x 16px (horizontal)
 * - Section gap: 24px (mobile), 32px (desktop)
 * - Content margin: 16px (mobile), 24px (desktop)
 * 
 * =============================================
 * RESPONSIVE DESIGN BREAKPOINTS
 * =============================================
 * 
 * - **xs** (320px) - Small phones
 * - **sm** (640px) - Large phones, small tablets
 * - **md** (768px) - Tablets
 * - **lg** (1024px) - Desktop
 * - **xl** (1280px) - Large desktop
 * - **2xl** (1536px) - Extra large
 * 
 * ### Mobile-First Approach
 * ```tsx
 * // Mobile by default (320px)
 * <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
 *   ...items
 * </div>
 * ```
 * 
 * =============================================
 * ANIMATION & INTERACTION
 * =============================================
 * 
 * ### Transition Durations
 * - **Fast** (150ms) - Quick feedback, hovers
 * - **Base** (200ms) - Standard transitions
 * - **Slow** (300ms) - Important state changes
 * - **Slower** (500ms) - Attention-grabbing effects
 * 
 * ### Common Interactions
 * - Button hover: scale-up, shadow increase
 * - Card hover: shadow increase, slight lift
 * - Modal entrance: fade-in + slide-up
 * - Loading: pulse animation
 * 
 * =============================================
 * ACCESSIBILITY REQUIREMENTS
 * =============================================
 * 
 * ### Color Contrast
 * - Primary text on white: 4.5:1 (AA)
 * - Secondary text: 3:1 minimum
 * - Interactive elements: sufficient contrast
 * 
 * ### Touch Targets
 * - Minimum size: 44px × 44px
 * - Spacing between targets: minimum 8px
 * - Larger on mobile: ≥ 48px preferred
 * 
 * ### Keyboard Navigation
 * - All interactive elements must be focusable
 * - Focus indicators must be visible (1-3px)
 * - Tab order must follow logical flow
 * 
 * ### Screen Reader Support
 * - Semantic HTML (<button>, <input>, etc.)
 * - ARIA labels for icons
 * - Form labels associated with inputs
 * - Loading/error states announced
 * 
 * =============================================
 * COMPONENT STATE PATTERNS
 * =============================================
 * 
 * ### Loading State
 * ```tsx
 * <div className={STATES.loading.overlay}>
 *   <div className={STATES.loading.spinner} />
 * </div>
 * ```
 * 
 * ### Empty State
 * ```tsx
 * <div className={STATES.empty.container}>
 *   <ShoppingBag size={48} className={STATES.empty.icon} />
 *   <h4 className={STATES.empty.title}>Tidak ada pesanan</h4>
 *   <p className={STATES.empty.description}>Mulai pesan sekarang</p>
 * </div>
 * ```
 * 
 * ### Error State
 * ```tsx
 * <div className={`${ComponentStyles.alert.base} ${ComponentStyles.alert.error}`}>
 *   <AlertCircle size={20} />
 *   <p>Terjadi kesalahan, silakan coba lagi</p>
 * </div>
 * ```
 * 
 * ### Success State
 * ```tsx
 * <div className={`${ComponentStyles.alert.base} ${ComponentStyles.alert.success}`}>
 *   <CheckCircle size={20} />
 *   <p>Transaksi berhasil!</p>
 * </div>
 * ```
 * 
 * =============================================
 * BEST PRACTICES
 * =============================================
 * 
 * 1. **Consistency First** - Always use design tokens, avoid custom values
 * 2. **Mobile-First** - Design for mobile, enhance for desktop
 * 3. **Performance** - Lazy load images, optimize animations
 * 4. **Accessibility** - WCAG 2.1 AA minimum for all components
 * 5. **User Testing** - Validate designs with real users
 * 6. **Documentation** - Keep code comments and Storybook updated
 * 7. **Version Control** - Track design system changes
 * 
 * =============================================
 * MIGRATION GUIDE (From Old System)
 * =============================================
 * 
 * ### Old System → New System
 * 
 * Old: Inline styles, hardcoded values
 * New: ComponentStyles + PATTERNS + tokens
 * 
 * ### Example Migration
 * 
 * Before:
 * ```tsx
 * <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
 *   Click me
 * </button>
 * ```
 * 
 * After:
 * ```tsx
 * import { ComponentStyles } from '@/design-system/components';
 * 
 * <button className={`${ComponentStyles.button.base} ${ComponentStyles.button.primary} ${ComponentStyles.button.md}`}>
 *   Click me
 * </button>
 * ```
 * 
 * =============================================
 * EXTENDING THE DESIGN SYSTEM
 * =============================================
 * 
 * ### Adding New Component Style
 * 
 * 1. Define in ComponentStyles
 * 2. Use existing tokens (colors, spacing, etc.)
 * 3. Document usage
 * 4. Test across all breakpoints
 * 5. Update this guide
 * 
 * ### Adding New Token
 * 
 * 1. Add to tokens.ts
 * 2. Follow naming convention
 * 3. Use consistent scale
 * 4. Document purpose
 * 5. Update all references
 * 
 */

export const DESIGN_SYSTEM_VERSION = '1.0.0';
export const LAST_UPDATED = '2026-04-16';

export default {
  version: DESIGN_SYSTEM_VERSION,
  lastUpdated: LAST_UPDATED,
  description: 'PYU-GO Modern Premium UI System',
};
