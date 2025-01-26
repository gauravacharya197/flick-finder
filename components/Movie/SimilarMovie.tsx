"use client";

import { getSimilarMovies } from "@/services/MovieService";
import { Tag } from "antd";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { CustomTag } from "../Common/CustomTag";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import SectionHeader from "../Common/SectionHeader";

interface SimilarMovieProps {
  id: string;
  mediaType: string;
}

export const SimilarMovie: React.FC<SimilarMovieProps> = ({ id, mediaType }) => {
  // Use React Query for fetching similar movies
  const {
    data: similarMoviesData,
    isLoading,
    isError,
    error,
  } = useQuery<AxiosResponse<any>>({
    queryKey: ["similarMovies", id, mediaType],
    queryFn: () => getSimilarMovies(id, mediaType),
    enabled: !!id, // Only fetch if 'id' is provided
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2, // Retry failed queries twice
  });

  const movies = similarMoviesData?.data?.results || [];

  return (
    <div className="-mt-4 flex flex-col gap-4 w-full max-w-full">
  <SectionHeader text="You may like"/>

  {isLoading && <p>Loading similar movies...</p>}
  {isError && <p className="text-red-500">Error: {error?.message}</p>}
  {!isLoading && !isError && movies.length === 0 && (
    <p>No similar movies found.</p>
  )}

  {movies.map((relatedMovie, index) => (
    <div
      key={index}
      className="flex items-start gap-4 rounded-md bg-white p-3 shadow-lg dark:bg-gray-800 w-[110%] md:w-full"
    >
      <Link
        href={`/watch/${mediaType}/${relatedMovie.id}`}
        className="flex items-center space-x-2 hover:text-primary"
      >
        <img
          src={`http://image.tmdb.org/t/p/w500/${relatedMovie?.posterPath}`}
          alt={relatedMovie?.title}
          className="h-24 w-16 rounded-md"
          onError={(e) => {
            e.currentTarget.src =
              "https://icon-library.com/images/no-picture-available-icon/no-picture-available-icon-1.jpg"; // Fallback image
            e.currentTarget.onerror = null; // Prevent infinite loop
          }}
        />
        <div className="w-full">
          <h3 className="text-lg font-bold">{relatedMovie?.displayTitle}</h3>
          <p className="text-sm">{relatedMovie?.displayReleaseDate}</p>
          <div className="flex gap-2">
            <span className="rounded px-2 py-1 flex items-center gap-1 bg-gray-100 dark:bg-gray-700">
              <FaStar className="mb-1 text-yellow-500" />
              {Number(relatedMovie?.voteAverage?.toFixed(1))}
            </span>
            <span className="rounded px-2 py-1">
              <CustomTag text={relatedMovie?.mediaType} />
            </span>
          </div>
        </div>
      </Link>
    </div>
  ))}
</div>

  );
};
