'use client'
import { useEffect, useRef } from 'react'

interface UseInfiniteScrollOptions {
  fetchNextPage: () => void
  hasNextPage?: boolean
  isFetching?: boolean
}

export const useInfiniteScroll = ({
  fetchNextPage,
  hasNextPage,
  isFetching,
}: UseInfiniteScrollOptions) => {
  const observerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage()
        }
      },
      { threshold: 1.0 } // Trigger when the element is fully visible
    )
    if (observerRef.current) observer.observe(observerRef.current)
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current)
    }
  }, [fetchNextPage, hasNextPage, isFetching])

  return observerRef
}
