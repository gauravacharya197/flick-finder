"use client";
import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { getTrending } from "@/services/MovieService";
import ErrorMessage from "./ErrorMessage";
import { MediaType } from "@/types/mediaType";
import Skeleton from "./Skeleton";
import { MovieList } from "../movie/MovieList";
interface ExploreProps {
  mediaType: MediaType;
}

export const MediaSection: React.FC<ExploreProps> = ({ mediaType }) => {
  const {
    error,
    isError,
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["trending", mediaType],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getTrending(
        mediaType,
        "week",
        pageParam.toString(),
      );
      return response;
    },
    getNextPageParam: (lastPage, pages) => {
      const totalPages = lastPage.data.totalPages;
      const currentPage = pages.length;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 60 * 24, // Cache the data for 1day
  });

  const observerRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetching,
  });

  const movies = data?.pages.flatMap((page) => page.data.results) || [];
  return (
    <>
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
          className="mt-2 w-full"
          message={
            error?.message ||
            "Something went wrong while fetching movie details."
          }
        />
      ) : (
        <>
          <MovieList movies={movies} showFeaturedMovie />
          {hasNextPage && (
            <div ref={observerRef} className="loading-indicator">
              {isFetching && <h1>Loading...</h1>}
            </div>
          )}
          {!hasNextPage && (
            <p className="mt-4 text-center">
              You've reached the end of the list
            </p>
          )}
        </>
      )}
    </>
  );
};
