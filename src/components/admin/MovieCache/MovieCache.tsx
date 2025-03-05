"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/primitives/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { CustomTag } from "@/components/common/CustomTag";
import { truncateString } from "@/utils/truncateString";
import { getMovies } from "@/services/MovieService"; // Import delete service
import { formatDateTime } from "@/utils/formatDateTime";
import { Button } from "@/components/ui/primitives/button";
import { FaTrash } from "react-icons/fa6";
import { deleteMovie } from "@/services/AdminService";
import toast from "react-hot-toast";
export default function MovieDetailCache() {
  const queryClient = useQueryClient();
  const { mediaCategories } = useSelector((state: any) => state.filters);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: movieData, isLoading: featuredLoading } = useQuery({
    queryKey: ["movieCaches", selectedCategory],
    queryFn: () => getMovies(selectedCategory),
    staleTime: 5 * 60 * 1000
  });

  // Mutation to delete a movie
  const deleteMutation = useMutation({
    mutationFn: deleteMovie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movieCaches", selectedCategory] });
      toast.success('Movie removed successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to remove movie')
    }
  });

  const handleDelete = async (movieId: string) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      deleteMutation.mutate(movieId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white dark:text-gray-100">
          Movie Caches
        </h1>
        
        <div className="flex items-center space-x-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="max-w-xs border-gray-700 bg-gray-800 ring-gray-700 lg:w-[200px] text-white">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent className="border-gray-700 bg-gray-800 text-gray-100">
              {mediaCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {movieData?.data.totalCount && (
            <span className="text-gray-500">
              Total Movies: {movieData.data.totalCount}
            </span>
          )}
        </div>
      </div>

      {featuredLoading ? (
        <div>Loading...</div>
      ) : movieData?.data?.results?.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Poster</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Release Date</TableHead>
              <TableHead>Media Type</TableHead>
              <TableHead>Overview</TableHead>
              <TableHead>CreatedAt</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movieData?.data?.results.map((movie, index) => (
              <TableRow key={index}>
                <TableCell>
                  {movie.posterPath ? (
                    <img 
                      src={`https://image.tmdb.org/t/p/w92${movie.posterPath}`}
                      alt={movie.displayTitle}
                      className="h-16 w-12 object-cover rounded"
                    />
                  ) : (
                    <div className="h-16 w-12 bg-gray-200 rounded flex items-center justify-center">
                      No image
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">
                  {movie.displayTitle}
                </TableCell>
                <TableCell>
                  {movie.displayReleaseDate || "Release date unknown"}
                </TableCell>
                <TableCell>
                  <CustomTag text={movie.mediaType} />
                </TableCell>
                <TableCell>
                  {truncateString(movie.overview, 40)}
                </TableCell>
                <TableCell>
                  {formatDateTime(movie.createdAtCache)}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDelete(movie.id)}
                  >
                    <FaTrash color="red" size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
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
