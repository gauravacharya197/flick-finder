"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/primitives/input";
import { FaSearch } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { featuredMediaCategories } from "@/data/featuredMediaCategory";
import { GetMovieDetailCache } from "@/services/AdminService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/primitives/table";
import { CustomTag } from "@/components/common/CustomTag";
import { truncateString } from "@/utils/truncateString";
import Pagination from "@/components/ui/Pagination";
import { formatDateTime } from "@/utils/formatDateTime";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

export default function MovieDetailCache() {
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<'CreatedAt' | 'UpdatedAt'>('CreatedAt');
  const [sortDescending, setSortDescending] = useState(true);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      // Reset to first page when search changes
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { 
    data: movieData, 
    isLoading: featuredLoading 
  } = useQuery({
    queryKey: ["movieDetailCache", debouncedSearch, currentPage,sortBy, 
        sortDescending],
    queryFn: () => GetMovieDetailCache(debouncedSearch, currentPage.toString(),sortBy,sortDescending),
    staleTime : 5*60*1000
  });

  // Calculate total pages
  const totalPages = movieData 
    ? Math.ceil(movieData.data.totalCount / 10) 
    : 0;

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleSort = (column: 'CreatedAt' | 'UpdatedAt') => {
    // If clicking the same column, toggle sort direction
    if (sortBy === column) {
      setSortDescending(!sortDescending);
    } else {
      // If changing column, default to descending
      setSortBy(column);
      setSortDescending(true);
    }
  };
  

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-white dark:text-gray-100">
          Movie Details Caches
        </h1>
       {/* Improved Total Count Display */}
      <div className="flex items-center space-x-3">
        
        <div>
         
          <p className="text-2xl font-bold text-teal-500 dark:text-teal-300">
            {movieData?.data.totalCount.toLocaleString()}
          </p>
        </div>
     
      
    </div>
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
      ) : movieData?.data?.movies?.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Poster</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Release Date</TableHead>
                <TableHead>Media Type</TableHead>
                <TableHead>Overview</TableHead>
                <TableHead 
  onClick={() => handleSort('CreatedAt')}
  className="cursor-pointer hover:bg-accent"
>
  <div className="flex items-center gap-2">
    CreatedAt 
    {sortBy === 'CreatedAt' && (sortDescending ? <FaChevronDown/> : <FaChevronUp/>)}
  </div>
</TableHead>
<TableHead 
  onClick={() => handleSort('UpdatedAt')}
  className="cursor-pointer hover:bg-accent"
>
  <div className="flex items-center gap-2">
    UpdatedAt 
    {sortBy === 'UpdatedAt' && (sortDescending ? <FaChevronDown/> : <FaChevronUp/>)}
  </div>
</TableHead>

              </TableRow>
            </TableHeader>
            <TableBody>
              {movieData?.data?.movies.map((movie, index) => (
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
                    <CustomTag text={movie.movie.mediaType}/>
                  </TableCell>
                  <TableCell>
                    {truncateString(movie.movie.overview, 40)}
                  </TableCell>
                  <TableCell>
                  {formatDateTime(movie.movie.createdAtCache)}
                  </TableCell>
                  <TableCell>
                  {formatDateTime(movie.updatedAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Component */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
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