import FingerprintJS from '@fingerprintjs/fingerprintjs';

let fpPromise: Promise<any> | null = null;
let cachedFingerprint: string | null = null;

// Detect if running in Microsoft Edge
const isEdge = (): boolean => {
  const userAgent = navigator.userAgent;
  return userAgent.includes('Edg/') || userAgent.includes('Edge/');
};

// Fast fingerprint generation for Edge (bypasses FingerprintJS)
const generateFastEdgeFingerprint = (): string => {
  try {
    // Check if we already have a cached fingerprint for this session
    const sessionKey = 'edge_fast_fp';
    const cached = sessionStorage.getItem(sessionKey);
    if (cached) {
      return cached;
    }

    // Collect only fast, reliable browser properties
    const components = [
      // Screen properties (instant)
      `${screen.width}x${screen.height}x${screen.colorDepth}`,
      
      // Navigator properties (instant)
      navigator.language,
      navigator.languages?.join(',') || '',
      navigator.platform,
      navigator.hardwareConcurrency?.toString() || '0',
      
      // Timezone (instant)
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      new Date().getTimezoneOffset().toString(),
      
      // User agent hash (to avoid storing full UA)
      btoa(navigator.userAgent).slice(-10),
      
      // Memory info if available (instant)
      (navigator as any).deviceMemory?.toString() || '',
      
      // Connection info if available (instant)
      (navigator as any).connection?.effectiveType || '',
    ];

    // Simple but effective hash
    let hash = 0;
    const combined = components.filter(Boolean).join('|');
    
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    const fingerprint = `edge_${Math.abs(hash).toString(36)}`;
    
    // Cache for the session
    try {
      sessionStorage.setItem(sessionKey, fingerprint);
    } catch (e) {
      console.warn('Could not cache Edge fingerprint');
    }
    
    return fingerprint;
    
  } catch (error) {
    console.error('Fast Edge fingerprint generation failed:', error);
    return `edge_fallback_${Date.now().toString(36)}`;
  }
};

export const getUserFingerprint = async (): Promise<string> => {
  // For Edge: Use fast fingerprinting, skip FingerprintJS entirely
  if (isEdge()) {
    if (cachedFingerprint) {
      return cachedFingerprint;
    }
    
    cachedFingerprint = generateFastEdgeFingerprint();
    return cachedFingerprint;
  }

  // For other browsers: Use FingerprintJS with minimal config
  try {
    if (!fpPromise) {
      fpPromise = FingerprintJS.load({
        delayFallback: 500,
      });
    }
    
    const fp = await Promise.race([
      fpPromise,
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 3000)
      )
    ]);
    
    const result = await Promise.race([
      (fp as any).get(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 2000)
      )
    ]);
    
    return result.visitorId;
    
  } catch (error) {
    console.error('FingerprintJS failed, using fallback:', error);
    
    // Fallback for non-Edge browsers
    const fallbackId = `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      const stored = sessionStorage.getItem('fp_fallback');
      if (stored) return stored;
      sessionStorage.setItem('fp_fallback', fallbackId);
    } catch (e) {
      console.warn('SessionStorage not available');
    }
    
    return fallbackId;
  }
};

// Clear all cached fingerprints
export const clearFingerprintCache = (): void => {
  fpPromise = null;
  cachedFingerprint = null;
  try {
    sessionStorage.removeItem('edge_fast_fp');
    sessionStorage.removeItem('fp_fallback');
  } catch (error) {
    console.warn('Could not clear cache:', error);
  }
};

// Check if using fast Edge mode
export const isUsingFastEdgeMode = (): boolean => {
  return isEdge();
};

// Get fingerprint synchronously for Edge (instant)
export const getEdgeFingerprintSync = (): string | null => {
  if (!isEdge()) return null;
  
  if (cachedFingerprint) {
    return cachedFingerprint;
  }
  
  cachedFingerprint = generateFastEdgeFingerprint();
  return cachedFingerprint;
};