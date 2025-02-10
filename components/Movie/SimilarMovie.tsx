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
import { SimilarMovieCard } from "./SimilarMovieCard";

interface SimilarMovieProps {
  id: string;
  mediaType: string;
}

export const SimilarMovie: React.FC<SimilarMovieProps> = ({ id, mediaType }) => {
  const {
    data: similarMoviesData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery<AxiosResponse<any>>({
    queryKey: ["similarMovies", id, mediaType],
    queryFn: () => getSimilarMovies(id, mediaType),
    enabled: !!id,
    staleTime: Infinity,
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
    <aside   className=" max-w-sm -mt-4  md:w-[80%] sm:max-w-none">
      {/* className="-mt-4 flex flex-col gap-4 w-full max-w-full" */}
      <SectionHeader text="You might like" />

      <div className="space-y-4 mt-4">
        {isLoading  || !id? (
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
          <div className="text-center py-1 text-gray-500 dark:text-gray-400">
            <p>No similar content found</p>
          </div>
        ) : (
          movies.map((movie, index) => (
            <SimilarMovieCard key={index} movie={movie}  mediaType={mediaType} index={index}/>
          ))
        )}
      </div>
    </aside>
  );
};