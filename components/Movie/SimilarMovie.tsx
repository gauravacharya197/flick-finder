"use client";

import { getSimilarMovies } from "@/services/MovieService";
import Link from "next/link";
import { FaStar, FaClock } from "react-icons/fa";
import { CustomTag } from "../Common/CustomTag";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import SectionHeader from "../Common/SectionHeader";
import { motion } from "framer-motion";
import { Skeleton } from "antd";
import { Rating } from "../Common/Rating";

interface SimilarMovieProps {
  id: string;
  mediaType: string;
}

export const SimilarMovie: React.FC<SimilarMovieProps> = ({ id, mediaType }) => {
  const {
    data: similarMoviesData,
    isLoading,
    isError,
    error,
  } = useQuery<AxiosResponse<any>>({
    queryKey: ["similarMovies", id, mediaType],
    queryFn: () => getSimilarMovies(id, mediaType),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const movies = similarMoviesData?.data?.results || [];

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-red-600 dark:text-red-400">
        <p>Error loading similar content: {error?.message}</p>
      </div>
    );
  }

  return (
    <aside   className=" max-w-sm -mt-4 w-[110%] md:w-[80%] sm:max-w-none">
      {/* className="-mt-4 flex flex-col gap-4 w-full max-w-full" */}
      <SectionHeader text="You might like" />
      
      <div className="space-y-4 mt-4">
        {isLoading ? (
          // Loading skeletons
          [...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-3 rounded-lg bg-gray-100 dark:bg-gray-800/50 p-3">
              <Skeleton active  className="h-24 w-16 rounded-md" />
              <div className="space-y-2 flex-1">
                <Skeleton active className="h-4 w-3/4" />
                <Skeleton active className="h-3 w-1/2" />
                <Skeleton active className="h-6 w-24" />
              </div>
            </div>
          ))
        ) : movies.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No similar content found</p>
          </div>
        ) : (
          movies.map((movie, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              key={movie.id}
              className="group relative overflow-hidden rounded-lg bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <Link
                href={`/watch/${mediaType}/${movie.id}`}
                className="flex gap-3 p-3"
              >
                <div className="relative overflow-hidden rounded-md">
                  <img
                    src={`http://image.tmdb.org/t/p/w500/${movie?.posterPath}`}
                    alt={movie?.title}
                    className="h-24 w-16 object-cover transform transition-transform group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "https://icon-library.com/images/no-picture-available-icon/no-picture-available-icon-1.jpg";
                      e.currentTarget.onerror = null;
                    }}
                  />
                </div>
                
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-primary transition-colors">
                    {movie?.displayTitle}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <FaClock className="w-3 h-3" />
                    <span>{movie?.displayReleaseDate}</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    <Rating voteAverage={movie?.voteAverage}/>
                    <CustomTag text={movie?.mediaType} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </aside>
  );
};