"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  deletefeatureMovie,
  featureMovie,
  getFeaturedMovie,
} from "@/services/FeatureMovieService";
import toast from "react-hot-toast";
import { FaSearch } from "react-icons/fa";

export default function FeaturePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const { data: featured, isLoading: featuredLoading } = useQuery({
    queryKey: ["featureMovie", searchQuery],
    queryFn: () => getFeaturedMovie(searchQuery),
    staleTime: 1000 * 60 * 60 * 24,
  });

  const mutation = useMutation({
    mutationFn: ({ action, movie }: { action: string; movie: any }) => {
      if (action === "add") {
        return featureMovie(movie);
      } else if (action === "remove") {
        return deletefeatureMovie(movie.id);
      }
      return Promise.reject(new Error("Invalid action"));
    },
    onSuccess: () => {
      toast.success("Movie updated successfully", {
        position: "bottom-center",
      });
      queryClient.invalidateQueries({ queryKey: ["featureMovie", searchQuery] });
    },
    onError: () => {
      toast.error("Failed to update movie", { position: "bottom-center" });
    },
  });

  const handleFeature = (movie: any) => {
    mutation.mutate({ action: "add", movie });
  };

  const handleUnfeature = (movie: any) => {
    mutation.mutate({ action: "remove", movie });
  };

 

  return (
    <div>
      <div >
        <h1 className="text-3xl font-bold text-white mb-4 dark:text-gray-100">
          Featured Movies
        </h1>
        
        <div className="relative mb-8 max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            className="pl-10 h-12  rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            type="text"
            placeholder="Search movies by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {featuredLoading ? (
          <div>Loading.. </div>
          ) : (
            featured?.data.results?.map((movie: any) => (
              <Card
                key={movie.id}
                className="group overflow-hidden transition-all duration-200 hover:shadow-lg dark:hover:shadow-indigo-900/20"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-1" title={movie?.displayTitle}>
                    {movie?.displayTitle}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {movie?.displayReleaseDate || "Release date unknown"}
                  </p>
                  
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 min-h-[4.5rem]">
                    {movie?.overview || "No description available"}
                  </p>
                </CardContent>
                
                <CardFooter className="flex gap-2 pt-3">
                  <Button
                    onClick={() => handleFeature(movie)}
                    variant="default"
                    size="sm"
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                    disabled={mutation.isPending}
                  >
                    Feature
                  </Button>
                  
                  <Button
                    onClick={() => handleUnfeature(movie)}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                    disabled={mutation.isPending}
                  >
                    Unfeature
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
        
        {featured?.data.results?.length === 0 && !featuredLoading && (
          <div className=" text-center">
            <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">
              No movies found
            </h3>
            <p className="mt-2 text-gray-400 dark:text-gray-500">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}