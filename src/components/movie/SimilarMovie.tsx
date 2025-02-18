"use client";

import { getSimilarMovies } from "@/services/MovieService";
import Link from "next/link";
import { FaStar, FaClock } from "react-icons/fa";
import { CustomTag } from "../common/CustomTag";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import SectionHeader from "../common/SectionHeader";
import { motion } from "framer-motion";
import { Rating } from "../common/Rating";
import { SimilarMovieCard } from "./SimilarMovieCard";
import Skeleton from "../common/Skeleton";

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
    <aside  >
      {/* className="-mt-4 flex flex-col gap-4 w-full max-w-full" */}
      <SectionHeader text="You might like" />

      <div className="space-y-4 mt-4">
        {isLoading  || !id? (
          // Loading skeletons
          [...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3 rounded-lg bg-gray-100 dark:bg-gray-800/30 p-3">
              <Skeleton   className="h-40 w-16 mt-3 rounded-md" />
              
            </div>
          ))
        ) : movies.length === 0 ? (
          <div className=" py-1 text-gray-500 dark:text-gray-400">
            <p>No similar content found</p>
          </div>
        ) : (
          movies.map((movie:any, index:any) => (
            <SimilarMovieCard key={index} movie={movie}  mediaType={mediaType} index={index}/>
          ))
        )}
      </div>
    </aside>
  );
};