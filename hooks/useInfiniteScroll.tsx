// hooks/useInfiniteScroll.ts
import { useCallback, useRef } from 'react';

export const useInfiniteScroll = (loading: boolean, setPage: (fn: (prev: number) => number) => void) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastItemElementRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading]);

  return lastItemElementRef;
};