/**
 * PYU-GO Design System Tokens
 * 
 * Modern, premium UI system based on:
 * - 8px grid system
 * - Accessibility-first approach
 * - Mobile-first responsive design
 * 
 * Built following industry standards from Gojek, Grab, Traveloka, AirAsia
 */

// =============================================
// COLOR PALETTE
// =============================================

export const COLORS = {
  // Primary Brand Colors (Blue theme - professional & trustworthy)
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6', // Primary
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },

  // Neutral Grayscale (primary text, backgrounds, borders)
  neutral: {
    0: '#FFFFFF',
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Semantic Colors
  success: {
    50: '#F0FDF4',
    500: '#10B981',
    600: '#059669',
  },

  warning: {
    50: '#FFFBEB',
    500: '#F59E0B',
    600: '#D97706',
  },

  error: {
    50: '#FEF2F2',
    500: '#EF4444',
    600: '#DC2626',
  },

  info: {
    50: '#EFF6FF',
    500: '#3B82F6',
    600: '#2563EB',
  },

  // Overlay & Backdrop
  overlay: {
    light: 'rgba(0, 0, 0, 0.25)',
    medium: 'rgba(0, 0, 0, 0.5)',
    dark: 'rgba(0, 0, 0, 0.75)',
  },
} as const;

// =============================================
// SPACING SYSTEM (8px base)
// =============================================

export const SPACING = {
  0: '0px',
  2: '0.25rem', // 4px
  4: '0.5rem',  // 8px
  6: '0.75rem', // 12px
  8: '1rem',    // 16px
  12: '1.5rem', // 24px
  16: '2rem',   // 32px
  20: '2.5rem', // 40px
  24: '3rem',   // 48px
  32: '4rem',   // 64px
  40: '5rem',   // 80px
  48: '6rem',   // 96px
} as const;

// =============================================
// TYPOGRAPHY SYSTEM
// =============================================

export const TYPOGRAPHY = {
  fontFamily: {
    sans: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,
    mono: `'SF Mono', 'Monaco', 'Inconsolata', 'Fira Mono', 'Droid Sans Mono', 'Source Code Pro', monospace`,
  },

  // Heading Scale
  heading: {
    h1: {
      fontSize: '2rem',     // 32px
      lineHeight: '2.5rem', // 40px
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h2: {
      fontSize: '1.5rem',   // 24px
      lineHeight: '2rem',   // 32px
      fontWeight: 700,
      letterSpacing: '-0.005em',
    },
    h3: {
      fontSize: '1.25rem',  // 20px
      lineHeight: '1.75rem', // 28px
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.125rem', // 18px
      lineHeight: '1.5rem', // 24px
      fontWeight: 600,
    },
  },

  // Body Text
  body: {
    large: {
      fontSize: '1.0625rem', // 17px
      lineHeight: '1.5rem',  // 24px
      fontWeight: 400,
    },
    base: {
      fontSize: '1rem',      // 16px
      lineHeight: '1.5rem',  // 24px
      fontWeight: 400,
    },
    small: {
      fontSize: '0.875rem',  // 14px
      lineHeight: '1.25rem', // 20px
      fontWeight: 400,
    },
  },

  // Labels & Captions
  label: {
    fontSize: '0.75rem',   // 12px
    lineHeight: '1rem',    // 16px
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },

  caption: {
    fontSize: '0.75rem',   // 12px
    lineHeight: '1rem',    // 16px
    fontWeight: 400,
  },
} as const;

// =============================================
// SHADOW SYSTEM (soft, not heavy)
// =============================================

export const SHADOWS = {
  none: 'none',

  // Subtle shadows for cards
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',

  // Elevation shadows (used sparingly)
  elevation: {
    1: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    2: '0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)',
    3: '0 10px 20px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.10)',
  },
} as const;

// =============================================
// BORDER RADIUS
// =============================================

export const BORDER_RADIUS = {
  none: '0px',
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.25rem',   // 20px
  '3xl': '1.5rem',    // 24px
  full: '9999px',
} as const;

// =============================================
// TRANSITIONS & ANIMATIONS
// =============================================

export const TRANSITIONS = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  slower: '500ms cubic-bezier(0.4, 0, 0.2, 1)',

  // Easing functions
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeLinear: 'linear',
  },
} as const;

// =============================================
// BREAKPOINTS (Mobile-first)
// =============================================

export const BREAKPOINTS = {
  xs: '320px',   // Mobile
  sm: '640px',   // Small devices
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px', // Extra large
} as const;

// =============================================
// Z-INDEX SCALE
// =============================================

export const Z_INDEX = {
  hide: -1,
  auto: 'auto',
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  backdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
  notification: 80,
} as const;

// =============================================
// COMPONENT SIZE TOKENS
// =============================================

export const SIZES = {
  // Touch target minimum (44px as per iOS HIG)
  touchTarget: '44px',

  // Button sizes
  button: {
    xs: '28px',
    sm: '36px',
    md: '44px',
    lg: '52px',
    xl: '60px',
  },

  // Input height
  input: {
    sm: '32px',
    md: '40px',
    lg: '48px',
  },

  // Icon sizes
  icon: {
    xs: '16px',
    sm: '20px',
    md: '24px',
    lg: '32px',
    xl: '40px',
  },
} as const;

// =============================================
// EXPORT DEFAULT THEME
// =============================================

export const DESIGN_TOKENS = {
  colors: COLORS,
  spacing: SPACING,
  typography: TYPOGRAPHY,
  shadows: SHADOWS,
  borderRadius: BORDER_RADIUS,
  transitions: TRANSITIONS,
  breakpoints: BREAKPOINTS,
  zIndex: Z_INDEX,
  sizes: SIZES,
} as const;

export default DESIGN_TOKENS;
