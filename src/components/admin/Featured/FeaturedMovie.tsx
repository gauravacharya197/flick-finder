"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/primitives/input";
import {
  deletefeatureMovie,
  featureMovie,
  getFeaturedMovie,
} from "@/services/FeatureMovieService";
import toast from "react-hot-toast";
import { FaSearch } from "react-icons/fa";
import FeaturedMoviesTable from "@/components/admin/Featured/FeaturedMovieTable";
import { Segmented } from "@/components/ui/Segmented";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";
import { MediaCategory } from "@/types/MediaCategory";
import { featuredMediaCategories } from "@/constants/featuredMediaCategory";

type FilterType = string;



export default function FeaturedMovies() {
  const [searchInput, setSearchInput] = useState("");
  const mediaCategories = featuredMediaCategories
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [featuredStates, setFeaturedStates] = useState<Record<string, boolean>>({});
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(
    mediaCategories[0]?.id || ""
  );
  const queryClient = useQueryClient();



  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: featuredMovies, isLoading: featuredLoading } = useQuery({
    queryKey: ["featureMovie", debouncedSearch, selectedFilter],
    queryFn: () => getFeaturedMovie(debouncedSearch, selectedFilter),
    //staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Update featuredStates whenever featured data changes
  useEffect(() => {
    if (featuredMovies?.data) {
      const initialStates = featuredMovies.data.reduce((acc: Record<string, boolean>, movie: any) => {
        acc[movie.movie.id] = movie.isFeatured;
        return acc;
      }, {});
      setFeaturedStates(initialStates);
    }
  }, [featuredMovies?.data]);

  const mutation = useMutation({
    mutationFn: ({ action, movie }: { action: string; movie: any }) => {
      if (action === "add") {
        return featureMovie(movie, selectedFilter);
      } else if (action === "remove") {
        return deletefeatureMovie(movie.id, selectedFilter);
      }
      return Promise.reject(new Error("Invalid action"));
    },
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["featureMovie"] });
      
      const newStatus = variables.action === "add";
      setFeaturedStates(prev => ({
        ...prev,
        [variables.movie.id]: newStatus
      }));

      return { 
        previousFeaturedState: featuredStates[variables.movie.id]
      };
    },
    onError: (err, variables, context) => {
      if (context) {
        setFeaturedStates(prev => ({
          ...prev,
          [variables.movie.id]: context.previousFeaturedState
        }));
      }
      toast.error("Failed to update movie", { position: "bottom-center" });
    },
    onSuccess: (data, variables) => {
      toast.success("Movie updated successfully", {
        position: "bottom-center",
      });
      //queryClient.invalidateQueries({ queryKey: ["featureMovie"] });
    },
  });

  const handleFeatureToggle = async (movie: any, currentStatus: boolean) => {
    mutation.mutate({
      action: currentStatus ? "remove" : "add",
      movie
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white dark:text-gray-100">
          Featured Movies
        </h1>
        
        <Segmented
  value={selectedFilter}
  onChange={setSelectedFilter}
  options={featuredMediaCategories.map(category => ({
    value: category.id,
    label: category.displayName
  }))}
  size="large"
  className="w-full max-w-md"
/>
      </div>
      
      <div className="relative max-w-md">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          className="pl-10 pr-10 h-12 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          type="text"
          placeholder="Search movies by title..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        {searchInput && (
          <button
            onClick={() => setSearchInput('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <MdClose className="h-5 w-5" />
          </button>
        )}
      </div>

      {featuredLoading ? (
        <div>Loading...</div>
      ) : featuredMovies?.data?.length > 0 ? (
        <FeaturedMoviesTable
          movies={featuredMovies?.data}
          featuredStates={featuredStates}
          onFeatureToggle={handleFeatureToggle}
          isLoading={featuredLoading}
        />
      ) : (
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">
            No movies found
          </h3>
          <p className="mt-2 text-gray-400 dark:text-gray-500">
            Try adjusting your search criteria
          </p>
        </div>
      )}
    </div>
  );
}