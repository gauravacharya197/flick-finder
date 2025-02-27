"use client";

import { getSimilarMovies } from "@/services/MovieService";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import SectionHeader from "../common/SectionHeader";
import { SimilarMovieCard } from "./SimilarMovieCard";
import Skeleton from "../common/Skeleton";
import { Movie } from "@/types/movie";
import { useEffect, useRef, useState } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

interface SimilarMovieProps {
  id: string;
  mediaType: string;
}

export const SimilarMovie: React.FC<SimilarMovieProps> = ({ id, mediaType }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  const triggerFetch = () => {
    setIsVisible(true);
  };
  
  const observerRef = useInfiniteScroll({
    fetchNextPage: triggerFetch,
    hasNextPage: !isVisible,
    isFetching: false
  });

  const {
    data: similarMoviesData,
    isLoading,
    isError,
    error,
  } = useQuery<AxiosResponse<any>>({
    queryKey: ["similarMovies", id, mediaType],
    queryFn: () => getSimilarMovies(id, mediaType),
    enabled: !!id && isVisible, // Only enable query when component is visible
    staleTime: Infinity,
    retry: 2,
  });

  const movies: Movie[] = similarMoviesData?.data?.results.map((movie): Movie => ({
    id: movie.id,
    posterPath: movie.poster_path,
    displayTitle: movie.title,
    displayReleaseDate: movie.release_date,
    voteAverage: movie.vote_average,
    mediaType: movie.media_type,
  })) || [];

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-red-600 dark:text-red-400">
        <p>Error loading similar content: {error?.message}</p>
      </div>
    );
  }

  return (
    <aside>
      <SectionHeader text="You might like" />
      <div 
        ref={observerRef} 
        aria-hidden="true"
      />
      <div className="space-y-4 mt-4 mb-">
        {(!isVisible || isLoading || !id) ? (
          // Loading skeletons
          [...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3 rounded-lg bg-gray-100 dark:bg-gray-800/30 p-3">
              <Skeleton className="h-40 w-16 mt-3 rounded-md" />
            </div>
          ))
        ) : movies.length === 0 ? (
          <div className="py-1 text-gray-500 dark:text-gray-400">
            <p>No similar content found</p>
          </div>
        ) : (
          movies.map((movie, index) => (
            <SimilarMovieCard key={index} movie={movie} mediaType={mediaType} index={index} />
          ))
        )}
      </div>
      
      {/* Observer element positioned at the top of the component */}
      
    </aside>
  );
};