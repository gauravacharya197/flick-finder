// pages/video/[id].js
import { useEffect } from 'react';
import Head from 'next/head';

const createPopupBlocker = () => {
  let lastUserInteraction = 0;
  let popupCount = 0;
  const popupCache = new Set();

  const trackUserInteraction = () => {
    lastUserInteraction = Date.now();
    popupCount = 0;
  };

  const shouldBlockPopup = () => {
    const now = Date.now();
    const timeSinceInteraction = now - lastUserInteraction;
    
 
    if (timeSinceInteraction > 1000 || popupCount > 2) {
      popupCount++;
      return true;
    }
    
    popupCount++;
    return false;
  };

  return {
    trackUserInteraction,
    shouldBlockPopup,
    popupCache
  };
};

  const VidPlayer = ({ sourceUrl }) => {
  useEffect(() => {
    const popupBlocker = createPopupBlocker();
    const originalOpen = window.open;
    const originalCreateElement = document.createElement;

    window.open = function(...args) {
      if (popupBlocker.shouldBlockPopup()) {
        console.log('Blocked popup:', args[0]);
        return null;
      }
      return originalOpen.apply(this, args);
    };

    document.createElement = function(tagName, options) {
      const element = originalCreateElement.call(document, tagName, options);
      
      if (tagName.toLowerCase() === 'iframe') {
        const originalSetAttribute = element.setAttribute;
        element.setAttribute = function(name, value) {
          if (name === 'src' && typeof value === 'string') {
            // Block known ad domains
            const blockedDomains = ['ads', 'banner', 'pop', 'track', 'analytics'];
            if (blockedDomains.some(domain => value.includes(domain))) {
              console.log('Blocked iframe:', value);
              return;
            }
          }
          return originalSetAttribute.call(this, name, value);
        };
      }
      
      return element;
    };

    const userEvents = ['click', 'touchstart', 'keydown', 'mousemove'];
    userEvents.forEach(event => {
      document.addEventListener(event, popupBlocker.trackUserInteraction, true);
    });

    const blockIframePopups = () => {
      const iframes = document.getElementsByTagName('iframe');
      Array.from(iframes).forEach(iframe => {
        try {
          if (iframe.contentWindow) {
            iframe.contentWindow.open = function() {
              console.log('Blocked iframe popup');
              return null;
            };
          }
        } catch (e) {
        }
      });
    };

    const intervalId = setInterval(blockIframePopups, 1000);

    const originalAddEventListener = window.addEventListener;
    window.addEventListener = function(type, listener, options) {
      if (type === 'beforeunload' || type === 'unload') {
        return;
      }
      return originalAddEventListener.call(this, type, listener, options);
    };

    return () => {
      // Cleanup
      window.open = originalOpen;
      document.createElement = originalCreateElement;
      userEvents.forEach(event => {
        document.removeEventListener(event, popupBlocker.trackUserInteraction, true);
      });
      clearInterval(intervalId);
      window.addEventListener = originalAddEventListener;
    };
  }, []);

  return (
    <>
      <Head>
        <meta httpEquiv="Window-Target" content="_top" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta
          httpEquiv="Content-Security-Policy"
          content="frame-ancestors 'self'; popup 'none'"
        />
      </Head>
      
        <iframe
          src={sourceUrl}
          poster="true" referrerpolicy="origin"
          allowFullScreen
          style={{ width: "95%", height: "60vh", border: "none" }}
        />
      
    </>
  );
}
export default VidPlayer;