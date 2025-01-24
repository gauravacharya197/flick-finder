"use client";
import { discover } from "@/services/MovieService";
import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector,useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { Segmented, Skeleton } from "antd";
import { setMediaType } from "@/redux/movies/advanceSearchSlice";
import { MovieList } from "../Movie/MovieList";

export const Trending = () => {
  const { query, countries, genres, years,mediaType } = useSelector(
    (state: RootState) => state.advanceSearch,
  );
  const dispatch = useDispatch();
  const [movies, setMovies] = useState<any>([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [page, setPage] = useState(1); // Page number state
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastMovieElementRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading]);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query); // Update debounced query only after delay

    }, 500); // Adjust the debounce delay as needed (e.g., 500ms)

    return () => {
      clearTimeout(handler); // Cleanup the timeout on every render
    };
  }, [query]);

  useEffect(() => {
    setPage(1); // Reset page to 1
    setMovies([]); // Clear the movie list
  }, [debouncedQuery, genres, countries, years,mediaType]);

  // API call effect
  useEffect(() => {
  
    setLoading(true)
    discover(
      page,
      debouncedQuery, // Use the debounced query
      countries,
      genres,
      years,
      mediaType
    )
      .then((response) => {
        setMovies((prevMovies) =>
          page === 1 ? response.data.results : [...prevMovies, ...response.data.results]
        );
      })
      .catch((error) => {
        toast.error("Error fetching popular movies:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, debouncedQuery, genres, years, countries,mediaType]);


  return (
    
    <>
      <h2 className="text-2xl font-bold pb-2">Trending Now</h2>
      
      <Segmented size="large" color="primary" value={mediaType} options={["All","Movie", "TV"]} className="custom-segmented"
      onChange={(value)=> dispatch(setMediaType(value))}
      />

      {loading && movies.length==0 ? (
        <Skeleton
          active
          className=" dark:text-white"
          title={{ width: "100%" }}
          paragraph={{
            rows: 10,
            width: ["100%", "100%", "100%", "100%", "50%", "50%", "50%", "50%"],
          }}
        /> // Show skeleton loader when loading
      ) : (
        <>
        
          <MovieList movies={movies} lastMovieElementRef={lastMovieElementRef}/>
          

        </>
      )}
    </>
  );
};
