/**
 * Form validation schemas using Zod
 * For use with React Hook Form
 */

/**
 * Email validation
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Password validation
 * Requirements:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 */
export function isValidPassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password minimal 8 karakter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password harus mengandung huruf besar');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password harus mengandung huruf kecil');
  }

  if (!/\d/.test(password)) {
    errors.push('Password harus mengandung angka');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Indonesian phone number validation
 */
export function isValidPhoneNumber(phone: string): boolean {
  // Accepts: 08xx, +628xx, or 628xx formats
  const phoneRegex = /^(\+62|62|0)8\d{8,11}$/;
  return phoneRegex.test(phone.replace(/\s|-/g, ''));
}

/**
 * Name validation
 */
export function isValidName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 100;
}

/**
 * Coordinate validation
 */
export function isValidCoordinate(latitude: number, longitude: number): boolean {
  return (
    !isNaN(latitude) &&
    !isNaN(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

/**
 * Validate auth form inputs
 */
export interface AuthFormValidation {
  email: { valid: boolean; error?: string };
  password: { valid: boolean; error?: string };
  fullName?: { valid: boolean; error?: string };
}

export function validateAuthForm(
  email: string,
  password: string,
  fullName?: string
): AuthFormValidation {
  return {
    email: isValidEmail(email)
      ? { valid: true }
      : { valid: false, error: 'Email tidak valid' },

    password: password.length > 0
      ? isValidPassword(password).valid
        ? { valid: true }
        : { valid: false, error: 'Password tidak memenuhi syarat' }
      : { valid: false, error: 'Password harus diisi' },

    fullName:
      fullName !== undefined
        ? isValidName(fullName)
          ? { valid: true }
          : { valid: false, error: 'Nama tidak valid (2-100 karakter)' }
        : undefined,
  };
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private timestamps: number[] = [];
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit: number = 5, windowMs: number = 60000) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  isAllowed(): boolean {
    const now = Date.now();
    // Remove timestamps outside the window
    this.timestamps = this.timestamps.filter(ts => now - ts < this.windowMs);

    if (this.timestamps.length < this.limit) {
      this.timestamps.push(now);
      return true;
    }

    return false;
  }

  getRemainingTime(): number {
    if (this.timestamps.length === 0) return 0;
    const oldestTimestamp = this.timestamps[0];
    const remainingMs = this.windowMs - (Date.now() - oldestTimestamp);
    return Math.max(0, Math.ceil(remainingMs / 1000));
  }
}
