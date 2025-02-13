import { useEffect, RefObject } from 'react';

type Handler = () => void;

function useClickOutside<T extends HTMLElement>(
  refs: RefObject<T>[] | RefObject<T>,
  handler: Handler,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      const refsArray = Array.isArray(refs) ? refs : [refs];
      
      // Check if click was outside all refs
      const isOutside = refsArray.every(ref => {
        const element = ref.current;
        return element && !element.contains(event.target as Node);
      });

      if (isOutside) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [refs, handler, enabled]);
}

export default useClickOutside;