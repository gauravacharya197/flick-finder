"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deletefeatureMovie,
  featureMovie,
  getFeaturedMovie,
} from "@/services/FeatureMovieService";
import toast from "react-hot-toast";
import { FaSearch } from "react-icons/fa";
import { truncateString } from "@/utils/truncateString";
import { Switch } from "@/components/ui/switch";

export default function FeaturePage() {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [featuredStates, setFeaturedStates] = useState<Record<string, boolean>>({});
  const queryClient = useQueryClient();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: featured, isLoading: featuredLoading } = useQuery({
    queryKey: ["featureMovie", debouncedSearch],
    queryFn: () => getFeaturedMovie(debouncedSearch),
  });

  // Update featuredStates whenever featured data changes
  useEffect(() => {
    if (featured?.data) {
      const initialStates = featured.data.reduce((acc: Record<string, boolean>, movie: any) => {
        acc[movie.movie.id] = movie.isFeatured;
        return acc;
      }, {});
      setFeaturedStates(initialStates);
    }
  }, [featured?.data]);

  const mutation = useMutation({
    mutationFn: ({ action, movie }: { action: string; movie: any }) => {
      if (action === "add") {
        return featureMovie(movie);
      } else if (action === "remove") {
        return deletefeatureMovie(movie.id);
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
      queryClient.invalidateQueries({ queryKey: ["featureMovie"] });
      toast.success("Movie updated successfully", {
        position: "bottom-center",
      });
    },
  });

  const handleFeatureToggle = async (movie: any, currentStatus: boolean) => {
    mutation.mutate({
      action: currentStatus ? "remove" : "add",
      movie
    });
  };

  // Helper function to get the current featured state
  const getMovieFeaturedState = (movie: any) => {
    // If we have a managed state, use it
    if (movie.movie.id in featuredStates) {
      return featuredStates[movie.movie.id];
    }
    // Otherwise fall back to the initial isFeatured value
    return movie.isFeatured;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white mb-4 dark:text-gray-100">
        Featured Movies
      </h1>
      
      <div className="relative max-w-md">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          className="pl-10 h-12 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          type="text"
          placeholder="Search movies by title..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {featuredLoading ? (
        <div>Loading...</div>
      ) : featured?.data?.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Poster</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Release Date</TableHead>
              <TableHead>Overview</TableHead>
              <TableHead className="text-right">Featured Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {featured?.data.map((movie: any, index) => {
              const isFeatured = getMovieFeaturedState(movie);
              return (
                <TableRow key={index}>
                  <TableCell>
                    {movie.movie.posterPath ? (
                      <img 
                        src={`https://image.tmdb.org/t/p/w92${movie.movie.posterPath}`}
                        alt={movie.movie.displayTitle}
                        className="h-16 w-12 object-cover rounded"
                      />
                    ) : (
                      <div className="h-16 w-12 bg-gray-200 rounded flex items-center justify-center">
                        No image
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {movie.movie.displayTitle}
                  </TableCell>
                  <TableCell>
                    {movie.movie.displayReleaseDate || "Release date unknown"}
                  </TableCell>
                  <TableCell>
                    {truncateString(movie.movie.overview, 40)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {isFeatured ? "Featured" : "Not Featured"}
                      </span>
                      <Switch
                        checked={isFeatured}
                        onCheckedChange={() => handleFeatureToggle(movie.movie, isFeatured)}
                        disabled={mutation.isPending}
                        className={`${isFeatured ? 'bg-blue-500' : 'bg-gray-200'} transition-colors`}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
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