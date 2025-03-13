"use client";

import { useEffect, useState } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { discover, getTrending } from "@/services/MovieService";
import { useInfiniteQuery } from "@tanstack/react-query";
import { MovieList } from "@/components/movie/MovieList";
import ErrorMessage from "@/components/common/ErrorMessage";
import Skeleton from "../common/Skeleton";
import SectionHeader from "../common/SectionHeader";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { MdSort } from "react-icons/md";
import { formatDate, getDateRange } from "@/utils/sortDate";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

interface SortOption {
  id: string;
  label: string;
  value: string;
}

const Explore: React.FC<any> = ({ mediaType }) => {
  const [sortOption, setSortOption] = useState<string>("popularity.desc");
  const { startDate, currentDate, endDate } = getDateRange(40, 6);
  
  // Media-type specific sort options
  const movieSortOptions: SortOption[] = [
    { id: "popular", label: "Popular", value: "popularity.desc" },
    { id: "top_rated", label: "Top Rated", value: "vote_count.desc" },
    { id: "revenue", label: "Top Grossing", value: "revenue.desc" },
    { id: "recent", label: "Recently Released", value: `popularity.desc&primary_release_date.gte=${formatDate(startDate)}&primary_release_date.lte=${formatDate(currentDate)}` },
  ];

  const tvSortOptions: SortOption[] = [
    { id: "popular", label: "Popular", value: "popularity.desc" },
    { id: "top_rated", label: "Top Rated", value: "vote_count.desc" },
  ];

  // Select correct sort options based on media type
  const sortOptions = mediaType === "movie" ? movieSortOptions : tvSortOptions;

  // Get current sort option label
  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === sortOption);
    return option ? option.label : "Popular";
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["explore", mediaType, sortOption],
    queryFn: async ({ pageParam = 1 }) => {
      // Check if it's TV media type with the popular sort option
      if (mediaType === "tv" && sortOption === "popularity.desc") {
        // Call the getTrending API for TV popular
        const response = await getTrending(
          "tv",
          "week",
          pageParam.toString()
        );
        return response;
      } else {
        // Use the regular discover API for all other cases
        const response = await discover({
          pageNumber: pageParam,
          mediaType,
          sortBy: sortOption,
        });
        return response;
      }
    },
    staleTime: Infinity,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.data.results.length === 0) {
        return undefined; // Stop pagination if results are empty
      }
      const totalPages = lastPage.data.totalPages;
      return pages.length < totalPages ? pages.length + 1 : undefined;
    },
    initialPageParam: 1,
    retry: 1,
  });

  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  const observerRef = useInfiniteScroll({ fetchNextPage, hasNextPage, isFetching });
  const movies = data?.pages.flatMap((page) => page.data.results) || [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 pt-2 border-b dark:border-gray-800">
        <SectionHeader text={`Browse ${capitalizeFirstLetter(mediaType)}`} />
        
        {/* shadcn/ui Select component */}
        <div className="mt-4 sm:mt-0 self-start sm:self-auto">
          <Select value={sortOption} onValueChange={handleSortChange}>
          <SelectTrigger className="max-w-xs border-gray-700 bg-gray-800 ring-gray-900 w-48 text-white">
          <div className="flex items-center gap-2">
                <MdSort className="text-lg" />
                <SelectValue placeholder={getCurrentSortLabel()} />
              </div>
            </SelectTrigger>
            <SelectContent className="border-gray-700 bg-gray-800 text-gray-100">

              {sortOptions.map((option) => (
                <SelectItem key={option.id} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

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
          {hasNextPage && (
            <div ref={observerRef} className="loading-indicator py-4 flex justify-center">
              {isFetching && (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-primary"></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Loading more</span>
                </div>
              )}
            </div>
          )}
          {!hasNextPage && <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">You've reached the end of the list</p>}
        </>
      )}
    </div>
  );
};

export default Explore;