import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Custom hook to prevent access to browser developer tools
 * @param {boolean} isProtectionEnabled - Toggle to enable/disable the protection
 * @param {string} redirectPath - Optional path to redirect when DevTools is detected (defaults to '/access-denied')
 * @returns {boolean} - Returns true if protection is active
 */
const useDevToolsProtection = (isProtectionEnabled, redirectPath = '/not-found') => {
  const router = useRouter();

  useEffect(() => {
    if (!isProtectionEnabled) return;

    let devToolsStatus = {
      isOpen: false,
      orientation: ''
    };

    // Check if the user is on mobile
    const isMobile = () => /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

    const checkDevToolsInitialState = () => {
      if (isMobile()) return; // Ignore mobile devices

      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      
      if (widthThreshold || heightThreshold) {
        devToolsStatus.isOpen = true;
        router.push(redirectPath);
      }
    };

    const devToolsDetector = () => {
      if (isMobile()) return; // Ignore mobile devices

      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;

      if (widthThreshold || heightThreshold) {
        if (!devToolsStatus.isOpen) {
          devToolsStatus.isOpen = true;
          router.push(redirectPath);
        }
      } else {
        devToolsStatus.isOpen = false;
      }
    };

    const detectDevTools = () => {
      if (isMobile()) return; // Ignore mobile devices

      const startTime = performance.now();
      console.profile();
      console.profileEnd();
      
      if (performance.now() - startTime > 20) {
        if (!devToolsStatus.isOpen) {
          devToolsStatus.isOpen = true;
          router.push(redirectPath);
        }
      }
    };

    const preventDevToolsShortcuts = (e) => {
      if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && [73, 74, 67].includes(e.keyCode))) {
        e.preventDefault();
        return false;
      }
    };

    checkDevToolsInitialState();

    const intervalId = setInterval(detectDevTools, 1000);
    window.addEventListener('resize', devToolsDetector);
    document.addEventListener('keydown', preventDevToolsShortcuts);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', devToolsDetector);
      document.removeEventListener('keydown', preventDevToolsShortcuts);
    };
  }, [isProtectionEnabled, router, redirectPath]);

  return isProtectionEnabled;
};

export default useDevToolsProtection;
