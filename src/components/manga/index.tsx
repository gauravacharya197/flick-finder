"use client";

import { useEffect, useState } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { getManga, getMangaGenre } from "@/services/MangaService";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { MovieList } from "@/components/movie/MovieList";
import ErrorMessage from "@/components/common/ErrorMessage";
import Skeleton from "../common/Skeleton";
import SectionHeader from "../common/SectionHeader";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { MdSort, MdSearch, MdFilterList } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { SortOption } from "@/types/sortOptions";
import { Button } from "../ui/primitives/button";




// Define the filter state type
interface FilterState {
  sortOption: string;
  selectedGenre: any | null;
}

// Default filter state
const DEFAULT_FILTER_STATE: FilterState = {
  sortOption: "popular",
  selectedGenre: null
};

const Manga: React.FC<any> = ({ mediaType = "manga" }) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  
  // Get the search query from URL
  const searchQuery = searchParams.get("q") || "";
  
  // Get stored filter state from React Query cache
  const { data: filterState } = useQuery({
    queryKey: ["mangaFilterState"],
    queryFn: () => {
      // This function should normally never run if initialData is provided
      return DEFAULT_FILTER_STATE;
    },
    initialData: () => {
      // Try to get existing filter state from cache, or use defaults
      return queryClient.getQueryData(["mangaFilterState"]) || DEFAULT_FILTER_STATE;
    },
    staleTime: Infinity // Never consider this data stale
  });
  
  // Update URL search param
  const updateSearchParam = useCallback((value: string) => {
    const url = new URL(window.location.href);
    const currentParams = new URLSearchParams(url.search);
    
    if (value) {
      currentParams.set("q", value);
    } else {
      currentParams.delete("q");
    }
    
    const paramString = currentParams.toString();
    const newUrl = `${window.location.pathname}${
      paramString ? `?${paramString}` : ""
    }`;
    
    router.push(newUrl, { scroll: false });
  }, [router]);
  
  // Update filter state in React Query cache
  const updateFilterState = useCallback((updates: Partial<FilterState>) => {
    queryClient.setQueryData(
      ["mangaFilterState"], 
      (oldData: FilterState | undefined) => ({
        ...(oldData || DEFAULT_FILTER_STATE),
        ...updates
      })
    );
  }, [queryClient]);

  // Fetch all available genres
  const { data: genresData, isLoading: genresLoading } = useQuery({
    queryKey: ["mangaGenres"],
    queryFn: async () => {
      const response = await getMangaGenre();
      return response;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  // Media-type specific sort options
  const mangaSortOptions: SortOption[] = [
    { id: "order[followedCount]=desc", label: "Popular", value: "popular" },
    { id: "order[createdAt]=desc", label: "Newest", value: "newest" },
    { id: "order[createdAt]=asc", label: "Oldest", value: "oldest" },
    { id: "order[title]=asc", label: "A-Z", value: "alphabetical" },
  ];

  // Get current sort option label
  const getCurrentSortItem = () => {
    const option = mangaSortOptions.find((opt) => opt.value === filterState.sortOption);
    return option || mangaSortOptions[0]; // Default to first option if not found
  };
  
  // Debounce search input handling
  const [inputValue, setInputValue] = useState(searchQuery);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== searchQuery) {
        updateSearchParam(inputValue);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [inputValue, searchQuery, updateSearchParam]);

  // Use React Query for data fetching with filter state values
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
    queryKey: [
      "Manga",
      mediaType,
      filterState.sortOption,
      searchQuery,
      filterState.selectedGenre?.id,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      // Call the getManga API with the search query, page number, and genre ID
      const response = await getManga(
        searchQuery,
        pageParam,
        filterState.selectedGenre?.id,
        getCurrentSortItem().id
      );

      // Sort the data based on the selected sort option
      let sortedData = [...response.data.data];

      // For "popular", use the default order from the API

      return {
        data: {
          results: sortedData,
          totalPages: response.data.totalPages || 1,
          currentPage: pageParam,
        },
      };
    },
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.data.currentPage;
      const totalPages = lastPage.data.totalPages;

      // If we've reached the last page, return undefined to stop fetching
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    retry: 1,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  // Handler functions
  const handleSortChange = (value: string) => {
    updateFilterState({ sortOption: value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const clearSearch = () => {
    setInputValue("");
    updateSearchParam("");
  };

  const handleGenreSelect = (genre: any | null) => {
    updateFilterState({ selectedGenre: genre });
  };

  // Set up the infinite scroll observer
  const observerRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetching,
  });

  // Aggregate all manga items from all pages
  const mangas = data?.pages.flatMap((page) => page.data.results) || [];

  // Transform manga data to match the expected format of MovieList component
  const transformedMangas = mangas.map((manga) => ({
    id: manga.id,
    displayTitle: manga.title,
    posterPath: `${baseUrl}api/File/image?url=${manga.coverImage}`,
    displayReleaseDate: manga.releasedDate,
    mediaType: "Manga",
  }));

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 pt-2 border-b dark:border-gray-800">
        <SectionHeader text={`Browse ${capitalizeFirstLetter(mediaType)}`} />

        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
  {/* Search input - full width on mobile */}
  <div className="relative w-full">
    <input
      type="text"
      placeholder="Search manga..."
      value={inputValue}
      onChange={handleSearchChange}
      className="w-full pl-10 pr-10 py-2 border rounded-md border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-1 focus:ring-primary h-10"
    />
    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
    {inputValue && (
      <button
        onClick={clearSearch}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
      >
        <IoMdClose className="text-lg" />
      </button>
    )}
  </div>

  {/* Filters row - side by side on all device sizes */}
  <div className="flex flex-row gap-3 w-full">
    {/* Genre filter */}
    <Select
      value={filterState.selectedGenre?.id || "All"}
      onValueChange={(value) => {
        if (value === "All") {
          handleGenreSelect(null);
        } else {
          const genre = genresData?.find((g: any) => g.id === value);
          if (genre) handleGenreSelect(genre);
        }
      }}
    >
      <SelectTrigger 
        className={`border-gray-700 ${filterState.selectedGenre?.id ? "bg-primary bg-opacity-20 text-primary" : "bg-gray-800"} 
        ring-gray-900 h-10 flex-1 md:w-42 lg:w-42`}
      >
        <div className="flex items-center gap-2">
          <MdFilterList className="text-lg" />
          <SelectValue 
            placeholder={filterState.selectedGenre?.name || "Genre"} 
          />
        </div>
      </SelectTrigger>
      <SelectContent className="border-gray-700 bg-gray-800 text-gray-100">
        <SelectItem value="All" className="cursor-pointer data-[highlighted]:bg-gray-700 data-[highlighted]:text-white">All Genres</SelectItem>
        {genresLoading ? (
          <div className="flex justify-center py-4">
            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-primary"></div>
          </div>
        ) : (
          genresData?.map((genre: any) => (
            <SelectItem key={genre.id} value={genre.id} className="cursor-pointer data-[highlighted]:bg-gray-700 data-[highlighted]:text-white">
              {genre.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>

    {/* Sort select */}
    <Select value={filterState.sortOption} onValueChange={handleSortChange}>
      <SelectTrigger 
        className={`border-gray-700 ${filterState.sortOption ? "bg-primary bg-opacity-20 text-primary" : "bg-gray-800"} 
        ring-gray-900 h-10 flex-1 sm:w-40 md:w-52 lg:w-64`}
      >
        <div className="flex items-center gap-2">
          <MdSort className="text-lg" />
          <SelectValue placeholder={getCurrentSortItem().label || "Popular"} />
        </div>
      </SelectTrigger>
      <SelectContent className="border-gray-700 bg-gray-800 text-gray-100">
        {mangaSortOptions.map((option) => (
          <SelectItem key={option.id} value={option.value} className="cursor-pointer data-[highlighted]:bg-gray-700 data-[highlighted]:text-white">
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
          rowWidths={
            ["100%", "100%", "100%", "100%", "50%", "50%", "50%", "50%"] as any
          }
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
            "Something went wrong while fetching manga details."
          }
        />
      ) : (
        <>
          <div className="mt-5">
            <MovieList movies={transformedMangas} />
          </div>
          {/* Infinite scroll loader */}
          {hasNextPage && (
            <div
              ref={observerRef}
              className="loading-indicator py-4 flex justify-center"
            >
              {isFetching && (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-primary"></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Loading more
                  </span>
                </div>
              )}
            </div>
          )}
          {!hasNextPage && transformedMangas.length > 0 && (
            <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
              You've reached the end of the list
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Manga;