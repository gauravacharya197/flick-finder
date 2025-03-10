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
    // Only apply protection if enabled
    if (!isProtectionEnabled) return;

    let devToolsStatus = {
      isOpen: false,
      orientation: ''
    };

    // Check if DevTools is already open on page load
    const checkDevToolsInitialState = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      
      // If DevTools is already open when page loads
      if (widthThreshold || heightThreshold) {
        devToolsStatus.isOpen = true;
        if (widthThreshold) {
          devToolsStatus.orientation = 'vertical';
        } else {
          devToolsStatus.orientation = 'horizontal';
        }
        router.push(redirectPath);
      }
    };

    // Monitor for DevTools being opened
    const devToolsDetector = () => {
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

    // Advanced detection with console methods
    const detectDevTools = () => {
      const startTime = performance.now();
      
      // This will be slower to execute when DevTools is open
      console.profile();
      console.profileEnd();
      
      // Check execution time
      if (performance.now() - startTime > 20) {
        if (!devToolsStatus.isOpen) {
          devToolsStatus.isOpen = true;
          router.push(redirectPath);
        }
      }
    };

    // Only block keyboard shortcuts for opening DevTools
    const preventDevToolsShortcuts = (e) => {
      // Prevent F12
      if (e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
      
      // Prevent Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
        e.preventDefault();
        return false;
      }
    };

    // Run initial check
    checkDevToolsInitialState();

    // Set up regular checking for dev tools
    const intervalId = setInterval(detectDevTools, 1000);

    // Add event listeners when protection is enabled
    window.addEventListener('resize', devToolsDetector);
    document.addEventListener('keydown', preventDevToolsShortcuts);

    // Clean up when component unmounts or when protection is disabled
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', devToolsDetector);
      document.removeEventListener('keydown', preventDevToolsShortcuts);
    };
  }, [isProtectionEnabled, router, redirectPath]); // Include dependencies

  return isProtectionEnabled; // Return whether protection is active
};

export default useDevToolsProtection;