'use client'
import React from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { MovieList } from '../movie/MovieList'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { getUserWatchList } from '@/services/WatchlistService'
import ErrorMessage from '../common/ErrorMessage'
import { useAuth } from '@/app/context/AuthContext'
import Skeleton from '../common/Skeleton'
export const Watchlist = () => {
  const { user } = useAuth()

  const {
    error,
    isError,
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isSuccess,
  } = useInfiniteQuery({
    queryKey: ['watchlist', user?.id],
    queryFn: async ({ pageParam = 1 }) => {
     
      const response = await getUserWatchList()
      return response
    },
    getNextPageParam: (lastPage, pages) => {
      const totalPages = lastPage.data.totalPages
      const currentPage = pages.length
      return currentPage < totalPages ? currentPage + 1 : undefined
    },
    initialPageParam: 1,
    staleTime: Infinity,
    retry: 0,
  })

  const observerRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetching,
  })

  const movies = React.useMemo(() => {
    if (!data?.pages) return []
    
    return data.pages.flatMap((page) => {
      return page.data.map((movie:any) => {
        try {
          const parsedContent = JSON.parse(movie.content)
          return {
            ...movie,
            parsedContent
          }
        } catch (e) {
          console.error('Error parsing movie content:', e)
          return {
            ...movie,
            parsedContent: null
          }
        }
      })
    })
  }, [data?.pages])

  const parsedMovies = movies.map((x) => x.parsedContent)

  // Show loading skeleton during initial load
  if (isLoading) {
    return (
      <Skeleton 
      showTitle={false}
      rows={8}
      rowWidths={['100%', '100%', '100%', '100%', '50%', '50%', '50%', '50%'] as any}
      className="rounded-lg mt-3"
      titleHeight="h-8"
      rowHeight="h-5"
      spacing="space-y-6"
    />
    )
  }

  // Show error message if there's an error
  if (isError) {
    return (
      <ErrorMessage
        className="w-full mt-2"
        message={error?.message || 'Something went wrong while fetching movie details.'}
      />
    )
  }

  // Show empty message only when we're sure the data has loaded and it's empty
  if (isSuccess && parsedMovies.length === 0) {
    return <div className="text-center text-gray-500 mt-6">Your watchlist is empty.</div>
  }

  // Show movie list and infinite scroll
  return (
    <>
      <MovieList movies={parsedMovies} />
      {hasNextPage && (
        <div ref={observerRef} className="loading-indicator">
          {isFetching && <h1>Loading...</h1>}
        </div>
      )}
    </>
  )
}