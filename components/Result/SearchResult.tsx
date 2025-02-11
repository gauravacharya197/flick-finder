"use client";

import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { RootState } from "@/redux/store";
import { discover } from "@/services/MovieService";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import FilterOption from "@/components/Filter/FilterOption";
import { MovieList } from "@/components/Movie/MovieList";
import ErrorMessage from "@/components/Common/ErrorMessage";
import Skeleton from "../Common/Skeleton";

interface SearchResultProps {
  query?: string;
}

const SearchResult: React.FC<SearchResultProps> = ({ query }) => {
  const { countries, genres, years, sortBy, mediaType } = useSelector(
    (state: RootState) => state.advanceSearch
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["searchResult", query, sortBy, genres, years, countries, mediaType],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await discover({
        pageNumber: pageParam,
        keyword: query,
        country: countries,
        genre: genres,
        year: Number(years),
        mediaType,
        sortBy,
      });
      return response;
    },
    staleTime: Infinity,
    getNextPageParam: (lastPage, pages) => {
      const totalPages = lastPage.data.totalPages;
      return pages.length < totalPages ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
    retry: 1,
  });

  const observerRef = useInfiniteScroll({ fetchNextPage, hasNextPage, isFetching });
  const movies = data?.pages.flatMap((page) => page.data.results) || [];

  return (
    <div >
      {query && <h2 className="text-2xl font-bold pb-2">Results for '{query}'</h2>}
      <FilterOption />
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
        <ErrorMessage className="mt-2 w-full" message={error?.message || "Something went wrong while fetching movie details."} />
      ) : (
        <>
         <div className="mt-5">
        <MovieList movies={movies} />
      </div>
          {hasNextPage && <div ref={observerRef} className="loading-indicator">{isFetching && <h1 className="mt-2">Loading</h1>}</div>}
          {!hasNextPage && <p className="mt-4 text-center">You’ve reached the end of the list</p>}
        </>
      )}
     

      
    </div>
  );
};

export default SearchResult;
