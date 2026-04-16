/**
 * Environment Configuration
 * Centralized configuration for the application
 */

interface Config {
  // Supabase
  supabaseUrl: string;
  supabaseAnonKey: string;

  // API
  apiUrl: string;
  apiTimeout: number;

  // Ride Services
  rideServices: {
    maxRadius: number; // km
    averageSpeed: number; // km/h
    baseSearchRadius: number; // km
  };

  // Surge Pricing
  surgePricing: {
    enableDynamic: boolean;
    timeBasedMultipliers: Record<string, number>;
  };

  // Features
  features: {
    enableDispatch: boolean;
    enableFareCalculation: boolean;
    enableRideTracking: boolean;
  };

  // UI
  ui: {
    theme: 'light' | 'dark';
    language: 'id' | 'en';
  };
}

// Default configuration
const defaultConfig: Config = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',

  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  apiTimeout: 30000,

  rideServices: {
    maxRadius: 5,
    averageSpeed: 40,
    baseSearchRadius: 5,
  },

  surgePricing: {
    enableDynamic: true,
    timeBasedMultipliers: {
      peak: 1.5,
      moderate: 1.2,
      normal: 1.0,
    },
  },

  features: {
    enableDispatch: true,
    enableFareCalculation: true,
    enableRideTracking: true,
  },

  ui: {
    theme: 'light',
    language: 'id',
  },
};

// Environment-specific overrides
const environmentConfigs: Record<string, Partial<Config>> = {
  development: {},
  staging: {
    apiUrl: import.meta.env.VITE_STAGING_API_URL || defaultConfig.apiUrl,
  },
  production: {
    apiUrl: import.meta.env.VITE_PRODUCTION_API_URL || defaultConfig.apiUrl,
  },
};

/**
 * Get current environment
 */
function getEnvironment(): string {
  return import.meta.env.MODE || 'development';
}

/**
 * Get merged configuration for current environment
 */
export function getConfig(): Config {
  const env = getEnvironment();
  const envConfig = environmentConfigs[env] || {};
  return {
    ...defaultConfig,
    ...envConfig,
  };
}

/**
 * Get specific config value
 */
export function getConfigValue<K extends keyof Config>(key: K): Config[K] {
  const config = getConfig();
  return config[key];
}

/**
 * Validate required configuration
 */
export function validateConfig(): { valid: boolean; errors: string[] } {
  const config = getConfig();
  const errors: string[] = [];

  if (!config.supabaseUrl) {
    errors.push('Missing VITE_SUPABASE_URL environment variable');
  }

  if (!config.supabaseAnonKey) {
    errors.push('Missing VITE_SUPABASE_ANON_KEY environment variable');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Log configuration on development
if (getEnvironment() === 'development') {
  console.log('[Config] Environment:', getEnvironment());
  console.log('[Config] Loaded from:', {
    supabaseUrl: getConfig().supabaseUrl.substring(0, 20) + '...',
    apiUrl: getConfig().apiUrl,
  });
}

export default getConfig();
