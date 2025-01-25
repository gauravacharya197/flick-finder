'use client';
import { SearchResult } from '@/components/SearchResult/SearchResult';
import { siteConfig } from '@/config/siteConfig';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import useMetadata from '@/hooks/useMetaData';
import { RootState } from '@/redux/store';
import { discover, getTrending } from '@/services/MovieService';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Alert, Skeleton } from 'antd';
import { Metadata } from 'next';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ResultsPage = ({ searchParams }: { searchParams: { query?: string } }) => {

  const {
  
    countries, 
    genres, 
    years, 
    sortBy 
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
    queryKey: ['trending', searchParams.query,sortBy,genres,years,countries],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await discover(pageParam,searchParams.query,countries,genres,years,'all',sortBy)
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
    <section className="pb-10 dark:bg-gray-900 dark:text-white md:pt-2 xl:pt-5">
    <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
      <div className="flex flex-col lg:items-start lg:gap-3 xl:gap-4">
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
          <div className="col-span-3">
              <div className="text-red-500 text-center">
            <h2>Error: {error.message || 'Something went wrong, please try again.'}</h2>
          </div>
            </div>
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
  </section>
  
      
    
  );
};

export default ResultsPage;
