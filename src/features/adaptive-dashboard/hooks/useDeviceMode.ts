import { useState, useEffect } from 'react';

export type DeviceMode = 'mobile' | 'desktop';

const MOBILE_BREAKPOINT = 768;

export const useDeviceMode = (): DeviceMode => {
  const [mode, setMode] = useState<DeviceMode>('desktop');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const checkMode = () => {
      setMode(window.innerWidth < MOBILE_BREAKPOINT ? 'mobile' : 'desktop');
    };

    // Initial check
    checkMode();

    // Debounced resize listener
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkMode, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Prevent hydration mismatch
  return isMounted ? mode : 'desktop';
};

export const useIsMobile = (): boolean => {
  const mode = useDeviceMode();
  return mode === 'mobile';
};

export const useIsDesktop = (): boolean => {
  const mode = useDeviceMode();
  return mode === 'desktop';
};
