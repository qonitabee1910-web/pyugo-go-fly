/**
 * PYU-GO Component Library & Patterns
 * 
 * Reusable component styles using TailwindCSS
 * Follows design system tokens for consistency
 */

import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, BORDER_RADIUS, TRANSITIONS } from './tokens';

// =============================================
// COMPONENT CLASS UTILITIES
// =============================================

export const ComponentStyles = {
  // ========== BUTTONS ==========
  button: {
    base: `inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`,

    // Variants
    primary: `bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md`,
    secondary: `bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300`,
    outline: `border-2 border-gray-300 text-gray-900 hover:border-gray-400 hover:bg-gray-50`,
    ghost: `text-blue-600 hover:bg-blue-50 active:bg-blue-100`,
    danger: `bg-red-600 text-white hover:bg-red-700 active:bg-red-800`,
    success: `bg-green-600 text-white hover:bg-green-700 active:bg-green-800`,

    // Sizes
    xs: `px-3 py-1.5 text-xs rounded-md`,
    sm: `px-4 py-2 text-sm rounded-lg`,
    md: `px-6 py-2.5 text-base rounded-lg`,
    lg: `px-8 py-3 text-base rounded-xl`,
    xl: `px-10 py-3.5 text-lg rounded-xl`,

    // Width variants
    full: `w-full`,
    icon: `p-2.5 rounded-lg`,
  },

  // ========== CARDS ==========
  card: {
    base: `bg-white rounded-xl border border-gray-100 ${SHADOWS.base} transition-all duration-200 hover:${SHADOWS.md}`,
    elevated: `bg-white rounded-xl ${SHADOWS.md}`,
    outlined: `bg-white rounded-xl border-2 border-gray-200`,
    ghost: `bg-gray-50 rounded-xl border border-gray-200`,
  },

  // ========== INPUTS ==========
  input: {
    base: `w-full px-4 py-2.5 text-base border-2 border-gray-200 rounded-lg bg-white transition-all duration-200`,
    focus: `focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`,
    error: `border-red-500 focus:border-red-600 focus:ring-red-500`,
    disabled: `bg-gray-50 cursor-not-allowed opacity-60`,
    placeholder: `placeholder-gray-400`,
  },

  // ========== BADGES ==========
  badge: {
    base: `inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold`,

    // Colors
    primary: `bg-blue-100 text-blue-800`,
    success: `bg-green-100 text-green-800`,
    warning: `bg-yellow-100 text-yellow-800`,
    error: `bg-red-100 text-red-800`,
    gray: `bg-gray-100 text-gray-800`,
  },

  // ========== CHIPS ==========
  chip: {
    base: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all`,
    selected: `bg-blue-600 text-white`,
    unselected: `bg-gray-100 text-gray-700 hover:bg-gray-200`,
  },

  // ========== DIVIDERS ==========
  divider: {
    horizontal: `h-px bg-gray-200`,
    vertical: `w-px bg-gray-200`,
  },

  // ========== TYPOGRAPHY ==========
  typography: {
    h1: `text-3xl font-bold text-gray-900 tracking-tight`,
    h2: `text-2xl font-bold text-gray-900 tracking-tight`,
    h3: `text-xl font-semibold text-gray-900`,
    h4: `text-lg font-semibold text-gray-900`,
    h5: `text-base font-semibold text-gray-900`,
    h6: `text-sm font-semibold text-gray-900`,

    body: `text-base text-gray-700 leading-relaxed`,
    bodySmall: `text-sm text-gray-600 leading-relaxed`,
    label: `text-xs font-semibold text-gray-700 uppercase tracking-wide`,
    caption: `text-xs text-gray-500`,
    muted: `text-gray-500`,
    error: `text-red-600`,
    success: `text-green-600`,
  },

  // ========== LOADING STATES ==========
  skeleton: {
    base: `animate-pulse bg-gray-200 rounded-lg`,
    line: `h-4 w-full bg-gray-200 rounded`,
    circle: `w-12 h-12 bg-gray-200 rounded-full`,
    avatar: `w-16 h-16 bg-gray-200 rounded-full`,
  },

  // ========== CONTAINERS ==========
  container: {
    maxWidth: `max-w-7xl`,
    padding: `px-4 sm:px-6 lg:px-8`,
    full: `w-full`,
  },

  // ========== SECTIONS ==========
  section: {
    spacing: `py-8 sm:py-12 lg:py-16`,
    spacingCompact: `py-6 sm:py-8`,
  },

  // ========== MODALS / OVERLAYS ==========
  modal: {
    backdrop: `fixed inset-0 bg-black/50 z-40 transition-opacity`,
    content: `fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4`,
    panel: `bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all`,
  },

  // ========== BOTTOM SHEET ==========
  bottomSheet: {
    base: `fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 transform transition-transform`,
    handle: `w-12 h-1 bg-gray-300 rounded-full mx-auto my-3`,
    content: `px-4 pb-8`,
  },

  // ========== NAVIGATION ==========
  navItem: {
    base: `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200`,
    active: `bg-blue-50 text-blue-600 font-semibold`,
    inactive: `text-gray-700 hover:bg-gray-50`,
  },

  // ========== ALERT / NOTIFICATION ==========
  alert: {
    base: `rounded-lg p-4 flex gap-3 items-start`,
    success: `bg-green-50 border border-green-200 text-green-800`,
    error: `bg-red-50 border border-red-200 text-red-800`,
    warning: `bg-yellow-50 border border-yellow-200 text-yellow-800`,
    info: `bg-blue-50 border border-blue-200 text-blue-800`,
  },

  // ========== GRADIENT BACKGROUNDS ==========
  gradient: {
    primary: `bg-gradient-to-r from-blue-600 to-blue-700`,
    success: `bg-gradient-to-r from-green-600 to-green-700`,
    warning: `bg-gradient-to-r from-yellow-500 to-orange-600`,
    error: `bg-gradient-to-r from-red-600 to-red-700`,
    subtle: `bg-gradient-to-br from-blue-50 to-indigo-50`,
  },

  // ========== RESPONSIVE GRID ==========
  grid: {
    mobile: `grid gap-4`,
    tablet: `grid grid-cols-2 gap-4`,
    desktop: `grid grid-cols-3 lg:grid-cols-4 gap-6`,
  },
} as const;

// =============================================
// COMMON PATTERN COMBINATIONS
// =============================================

export const PATTERNS = {
  // Card Button combination
  cardButton: `${ComponentStyles.card.base} cursor-pointer hover:${SHADOWS.lg} active:scale-95 transition-all`,

  // Primary CTA (Full-width mobile, auto desktop)
  primaryCTA: `${ComponentStyles.button.base} ${ComponentStyles.button.primary} ${ComponentStyles.button.lg} w-full sm:w-auto`,

  // Section header with alignment
  sectionHeader: `${ComponentStyles.typography.h2} mb-6 flex items-center justify-between`,

  // Input group (label + input + error)
  inputGroup: `space-y-2`,
  inputLabel: `${ComponentStyles.typography.label}`,
  inputError: `${ComponentStyles.typography.caption} ${ComponentStyles.typography.error}`,

  // Badge group
  badgeGroup: `flex flex-wrap gap-2 items-center`,

  // Sticky header
  stickyHeader: `sticky top-0 bg-white/95 backdrop-blur-sm z-20 border-b border-gray-100`,

  // Floating CTA
  floatingCTA: `fixed bottom-6 left-4 right-4 sm:bottom-8 sm:left-auto sm:right-8 sm:w-auto z-40`,

  // Page container
  pageContainer: `min-h-screen bg-gray-50 pb-24 sm:pb-8`,

  // Card container with spacing
  cardContainer: `space-y-4 sm:space-y-6`,

  // Responsive padding
  responsivePadding: `px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12`,
} as const;

// =============================================
// STATE UTILITIES
// =============================================

export const STATES = {
  loading: {
    overlay: `fixed inset-0 bg-black/10 z-50 flex items-center justify-center`,
    spinner: `w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin`,
  },

  empty: {
    container: `flex flex-col items-center justify-center py-12 text-center`,
    icon: `text-gray-300 mb-4`,
    title: `${ComponentStyles.typography.h4} mb-2 text-gray-900`,
    description: `${ComponentStyles.typography.bodySmall} text-gray-500 mb-6`,
  },

  error: {
    container: `${ComponentStyles.alert.base} ${ComponentStyles.alert.error}`,
    icon: `flex-shrink-0`,
  },

  success: {
    container: `${ComponentStyles.alert.base} ${ComponentStyles.alert.success}`,
    icon: `flex-shrink-0`,
  },
} as const;

// =============================================
// ANIMATION UTILITIES
// =============================================

export const ANIMATIONS = {
  fadeIn: `animate-in fade-in duration-200`,
  slideUp: `animate-in slide-in-from-bottom duration-300`,
  slideDown: `animate-in slide-in-from-top duration-300`,
  slideLeft: `animate-in slide-in-from-right duration-300`,
  slideRight: `animate-in slide-in-from-left duration-300`,
  scaleIn: `animate-in zoom-in duration-200`,
  pulse: `animate-pulse`,
  bounce: `animate-bounce`,
} as const;

export default ComponentStyles;
