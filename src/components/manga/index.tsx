"use client";

import { useEffect, useState } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { getManga } from "@/services/MangaService";
import { useInfiniteQuery } from "@tanstack/react-query";
import { MovieList } from "@/components/movie/MovieList";
import ErrorMessage from "@/components/common/ErrorMessage";
import Skeleton from "../common/Skeleton";
import SectionHeader from "../common/SectionHeader";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { MdSort, MdSearch } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";

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

interface MangaItem {
  title: string;
  releasedDate: string;
  coverImage: string;
  id: string;
}

const Manga: React.FC<any> = ({ mediaType = "manga" }) => {
  const [sortOption, setSortOption] = useState<string>("popular");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Media-type specific sort options
  const mangaSortOptions: SortOption[] = [
    { id: "popular", label: "Popular", value: "popular" },
    { id: "newest", label: "Newest", value: "newest" },
    { id: "oldest", label: "Oldest", value: "oldest" },
    { id: "alphabetical", label: "A-Z", value: "alphabetical" },
  ];

  // Get current sort option label
  const getCurrentSortLabel = () => {
    const option = mangaSortOptions.find((opt) => opt.value === sortOption);
    return option ? option.label : "Popular";
  };

  // Debounce search input to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["Manga", mediaType, sortOption, debouncedSearch],
    queryFn: async () => {
      // Call the getManga API with the search query
      const response = await getManga(debouncedSearch);

      // Sort the data based on the selected sort option
      let sortedData = [...response.data];

      if (sortOption === "newest") {
        sortedData.sort(
          (a, b) =>
            new Date(b.releasedDate).getTime() - new Date(a.releasedDate).getTime()
        );
      } else if (sortOption === "oldest") {
        sortedData.sort(
          (a, b) =>
            new Date(a.releasedDate).getTime() - new Date(b.releasedDate).getTime()
        );
      } else if (sortOption === "alphabetical") {
        sortedData.sort((a, b) => a.title.localeCompare(b.title));
      }
      // For "popular", use the default order from the API

      return {
        data: {
          results: sortedData,
          totalPages: 1, // Since we're getting all data at once
        },
      };
    },
    staleTime: Infinity,
    getNextPageParam: () => {
      // No need for pagination as we're getting all data at once
      return undefined;
    },
    initialPageParam: 1,
    retry: 1,
  });

  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const observerRef = useInfiniteScroll({ fetchNextPage, hasNextPage, isFetching });
  const mangas = data?.pages[0]?.data.results || [];

  // Transform manga data to match the expected format of MovieList component
  const transformedMangas = mangas.map((manga: MangaItem) => ({
    id: manga.id,
    displayTitle: manga.title,
    posterPath: manga.coverImage,
    displayReleaseDate: manga.releasedDate,
    mediaType: "Manga",
  }));

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 pt-2 border-b dark:border-gray-800">
        <SectionHeader text={`Browse ${capitalizeFirstLetter(mediaType)}`} />

        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Search manga..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full sm:w-64 pl-10 pr-10 py-2 border rounded-md border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-primary"
              style={{ height: "40px" }} // Match the height of the select component
            />
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <IoIosCloseCircle className="text-lg" />
              </button>
            )}
          </div>

          {/* shadcn/ui Select component */}
          <div className="self-start sm:self-auto">
            <Select value={sortOption} onValueChange={handleSortChange}>
              <SelectTrigger className="max-w-xs border-gray-700 bg-gray-800 ring-gray-900 w-48 text-white h-10">
                <div className="flex items-center gap-2">
                  <MdSort className="text-lg" />
                  <SelectValue placeholder={getCurrentSortLabel()} />
                </div>
              </SelectTrigger>
              <SelectContent className="border-gray-700 bg-gray-800 text-gray-100">
                {mangaSortOptions.map((option) => (
                  <SelectItem key={option.id} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <Skeleton
          showTitle={false}
          rows={8}
          rowWidths={["100%", "100%", "100%", "100%", "50%", "50%", "50%", "50%"] as any}
          className="rounded-lg mt-3"
          titleHeight="h-8"
          rowHeight="h-5"
          spacing="space-y-6"
        />
      ) : isError ? (
        <ErrorMessage
          className="mt-2 w-full"
          message={error?.message || "Something went wrong while fetching manga details."}
        />
      ) : transformedMangas.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-lg text-gray-400">No manga found matching your search.</p>
          <button
            onClick={clearSearch}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <>
          <div className="mt-5">
            <MovieList movies={transformedMangas} />
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
          {!hasNextPage && (
            <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
              {/* You've reached the end of the list */}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Manga;