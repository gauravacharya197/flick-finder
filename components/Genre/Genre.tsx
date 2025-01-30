'use client'
import React from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { Alert, Segmented, Skeleton } from 'antd'
import { setMediaType } from '@/redux/movies/advanceSearchSlice'
import { MovieList } from '../Movie/MovieList'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { discover, getTopRated, getTrending } from '@/services/MovieService'
import SectionHeader from '../Common/SectionHeader'
import ErrorMessage from '../Common/ErrorMessage'
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter'

export const Genre = ({value}) => {
  const { mediaType } = useSelector((state: RootState) => state.advanceSearch)
  const dispatch = useDispatch()
  const {  genres } = useSelector((state: any) => state.filters);
  
  const genre = genres.find(x => x.name.toLowerCase() === value.toLowerCase());
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
      const response = await discover(pageParam,'','',genreId,'',mediaType,'popularity.desc')
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
        className="custom-segmented mb-2"
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
