'use client'
import React from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { Alert, Segmented, Skeleton } from 'antd'
import { setMediaType } from '@/redux/movies/advanceSearchSlice'
import { MovieList } from '../Movie/MovieList'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { getTopRated, getTrending } from '@/services/MovieService'
import SectionHeader from '../Common/SectionHeader'
import ErrorMessage from '../Common/ErrorMessage'

export const TopRatedList = () => {
  const { mediaType } = useSelector((state: RootState) => state.advanceSearch)
  const dispatch = useDispatch()

  const {
    error,
    isError,
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['trending', mediaType],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getTopRated(mediaType, pageParam.toString())
      return response
    },
    getNextPageParam: (lastPage, pages) => {
      const totalPages = lastPage.data.totalPages
      const currentPage = pages.length
      return currentPage < totalPages ? currentPage + 1 : undefined
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 30, // Cache the data for 5 minutes (300,000 ms)
    retry:0
  })

  const observerRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetching,
  })

  const movies = data?.pages.flatMap((page) => page.data.results) || []

  return (
    <>
      <SectionHeader className="pb-4 pt-4" text="Top Rated Movies/TV Series"/>
      <Segmented
        size="large"
        value={mediaType}
        options={['Movie', 'TV']}
        className="custom-segmented"
        onChange={(value) => dispatch(setMediaType(value))}
      />
      {isLoading ? (
        <Skeleton
          active
          title={{ width: '100%' }}
          paragraph={{
            rows: 10,
            width: ['100%', '100%', '100%', '100%', '50%', '50%', '50%', '50%'],
          }}
        />
      ) : isError ? (
        <ErrorMessage
          className='w-full mt-2'
          message={error?.message || "Something went wrong while fetching movie details."}
         
        />
      ) : (
        <>
          <MovieList movies={movies} showFeaturedMovie/>
          {hasNextPage && (
            <div ref={observerRef} className="loading-indicator">
              {isFetching && <h1>LOADING</h1>}
            </div>
          )}
          {!hasNextPage && (
            <p className="text-center mt-4">You’ve reached the end of the list</p>
          )}
        </>
      )}
    </>
  )
}
