import { DashboardMobile } from './components/mobile/DashboardMobile';
import { DashboardDesktop } from './components/desktop/DashboardDesktop';
import { useDeviceMode } from './hooks/useDeviceMode';

/**
 * Adaptive Dashboard Component
 * Automatically renders mobile or desktop layout based on screen size
 *
 * Mobile: < 768px (Gojek/Grab style super app)
 * Desktop: ≥ 768px (Traveloka style rich dashboard)
 *
 * Shared:
 * - State management (Zustand)
 * - API hooks
 * - Utility functions
 * - Components (Header, Promo, BookingCard)
 */
export const AdaptiveDashboard = () => {
  const mode = useDeviceMode();

  return mode === 'mobile' ? <DashboardMobile /> : <DashboardDesktop />;
};

export default AdaptiveDashboard;
