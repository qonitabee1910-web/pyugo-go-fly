/**
 * Calculate estimated fare based on distance and service type
 */
export const calculateFare = (
  distanceKm: number,
  serviceType: 'economy' | 'comfort' | 'premium'
): number => {
  const baseFare = {
    economy: 7000,      // 7k IDR base
    comfort: 10000,     // 10k IDR base
    premium: 15000,     // 15k IDR base
  };

  const perKmRate = {
    economy: 2500,      // 2.5k per km
    comfort: 3500,      // 3.5k per km
    premium: 5000,      // 5k per km
  };

  const base = baseFare[serviceType];
  const perKm = perKmRate[serviceType];
  const totalFare = base + distanceKm * perKm;

  // Minimum fare
  const minimumFare = {
    economy: 15000,
    comfort: 20000,
    premium: 30000,
  };

  return Math.max(totalFare, minimumFare[serviceType]);
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Estimate travel time based on distance
 */
export const estimateTravelTime = (distanceKm: number): number => {
  // Assume average speed of 30 km/h in urban areas
  const minutes = Math.ceil((distanceKm / 30) * 60);
  return Math.max(minutes, 5); // Minimum 5 minutes
};

/**
 * Format currency in IDR
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format time remaining
 */
export const formatTimeRemaining = (minutes: number): string => {
  if (minutes < 1) return 'Kurang dari 1 menit';
  if (minutes === 1) return '1 menit';
  return `${minutes} menit`;
};

/**
 * Truncate address for mobile display
 */
export const truncateAddress = (address: string, maxLength = 40): string => {
  return address.length > maxLength ? `${address.substring(0, maxLength)}...` : address;
};

/**
 * Get relative time string
 */
export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} menit yang lalu`;
  if (diffHours < 24) return `${diffHours} jam yang lalu`;
  if (diffDays === 1) return 'Kemarin';
  if (diffDays < 7) return `${diffDays} hari yang lalu`;

  return date.toLocaleDateString('id-ID');
};
