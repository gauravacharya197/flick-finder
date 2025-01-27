'use client';
import ErrorMessage from '@/components/Common/ErrorMessage';
import { SearchResult } from '@/components/SearchResult/SearchResult';
import { siteConfig } from '@/config/siteConfig';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import useMetadata from '@/hooks/useMetaData';
import { setMediaType } from '@/redux/movies/advanceSearchSlice';
import { RootState } from '@/redux/store';
import { discover } from '@/services/MovieService';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Segmented, Skeleton } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ResultsPage = ({ searchParams }: { searchParams: { query?: string } }) => {
  useMetadata(`${searchParams.query? `${siteConfig.siteName} - Search result for ${searchParams.query}` : `${siteConfig.siteName} - Search Movies/TV`}`,"")
  const {
  
    countries, 
    genres, 
    years, 
    sortBy,
    mediaType
  } = useSelector((state: RootState) => state.advanceSearch);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['searchResult', searchParams.query,sortBy,genres,years,countries,mediaType],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await discover(pageParam,searchParams.query,countries,genres,years,mediaType,sortBy)
      return response
    },
    //staleTime: 5 * 60 * 1000,
    getNextPageParam: (lastPage, pages) => {
      const totalPages = lastPage.data.totalPages
      const currentPage = pages.length
      return currentPage < totalPages ? currentPage + 1 : undefined
    },
    initialPageParam: 1,
    retry:1
  })

  const observerRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetching,
  })

  const movies = data?.pages.flatMap((page) => page.data.results) || []
  
  
  return (
    <div className="min-h-screen dark:bg-gray-900 dark:text-white">
       <div className="container mx-auto px-4 lg:px-8 py-6 md:py-10">
      <SearchResult query={searchParams.query} movies={movies} />
      
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
      </div>
    </div>

  
      
    
  );
};

export default ResultsPage;
