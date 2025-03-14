'use client'
import React from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setMediaType } from '@/redux/movies/advanceSearchSlice'
import { MovieList } from '../movie/MovieList'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { discover, getTopRated, getTrending } from '@/services/MovieService'
import SectionHeader from '../common/SectionHeader'
import ErrorMessage from '../common/ErrorMessage'
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter'
import Skeleton from '../common/Skeleton'
import { Segmented } from '../ui/Segmented'

export const Genre = ({value}:any) => {
  const { mediaType } = useSelector((state: RootState) => state.advanceSearch)
  const dispatch = useDispatch()
  const {  genres } = useSelector((state: any) => state.filters);
  
  const genre = genres.find((x:any) => x.name.toLowerCase() === value.toLowerCase());
  const genreId = genre ? genre.externalId : null;
  const {
    error,
    isError,
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['genre', mediaType],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await discover({
        pageNumber: pageParam,
        genre: genreId,
        mediaType: mediaType,
        sortBy: 'popularity.desc'
      });
      return response
    },
    //enabled :genreId? true:false,
    getNextPageParam: (lastPage, pages) => {
      const totalPages = lastPage.data.totalPages
      const currentPage = pages.length
      return currentPage < totalPages ? currentPage + 1 : undefined
    },
    initialPageParam: 1,
    //staleTime: 1000 * 60 * 30, // Cache the data for 5 minutes (300,000 ms)
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
      <SectionHeader className="pb-4 pt-2" text={capitalizeFirstLetter(value)}/>
      <Segmented
        size="large"
        value={mediaType}
        options={['Movie', 'TV']}
        className="mb-2"
        onChange={(value) => dispatch(setMediaType(value))}
      />
      {isLoading ? (
        <Skeleton 
        showTitle={false}
        rows={8}
        rowWidths={['100%', '100%', '100%', '100%', '50%', '50%', '50%', '50%'] as any}
        className="rounded-lg mt-3"
        titleHeight="h-8"
        rowHeight="h-5"
        spacing="space-y-6"
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
            <div ref={observerRef} className="loading-indicator py-4 flex justify-center">
              {isFetching && (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-primary"></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Loading more</span>
                </div>
              )}
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
