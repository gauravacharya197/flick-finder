"use client";
import { discover, getPopular } from "@/services/MovieService";
import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { SearchFilter } from "../SearchFilter/SearchFilter";
import Link from "next/link";
import { useSelector,useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { Segmented, Skeleton, Tag, Tooltip } from "antd";
import { FaStar } from "react-icons/fa";
import { truncateString } from "@/utils/truncateString";
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import { setMediaType } from "@/redux/movies/advanceSearchSlice";

export const Trending = () => {
  const { query, countries, genres, years, imdbRating,mediaType } = useSelector(
    (state: RootState) => state.advanceSearch,
  );
  const { genres: genresData } = useSelector((state: any) => state.filters);
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
  }, [debouncedQuery, genres, countries, years, imdbRating,mediaType]);

  // API call effect
  useEffect(() => {
  
    setLoading(true)
    discover(
      page,
      debouncedQuery, // Use the debounced query
      countries,
      genres,
      years,
      imdbRating[0].toString(),
      imdbRating[1].toString(),
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
  }, [page, debouncedQuery, genres, imdbRating, years, countries,mediaType]);

  const featuredMovie = movies?.[0];
  const featuredMovieTitle = featuredMovie?.mediaType?.toLowerCase() === "movie" ? featuredMovie?.originalTitle : featuredMovie?.name;
  const featuredMovieRelease = featuredMovie?.mediaType?.toLowerCase() === "movie" ? featuredMovie?.releaseDate : featuredMovie?.firstAirDate;
  return (
    
    <>
      <h2 className="text-2xl font-bold">Trending Now</h2>
      <SearchFilter />
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
        
          {featuredMovie && (
            
            <div className="relative mb-8  w-full">
              <Link href={`watchnow/${featuredMovie.id}`}>
                <img
                  src={`http://image.tmdb.org/t/p/original/${featuredMovie?.backdropPath}`}
                  alt={featuredMovieTitle}
                  className="h-full w-full rounded-md object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://icon-library.com/images/no-picture-available-icon/no-picture-available-icon-1.jpg"; // Fallback image
                    e.currentTarget.onerror = null; // Prevent infinite loop in case fallback image is also not found
                  }}
                />
                <div className="absolute inset-0 flex flex-col justify-end rounded-md bg-black bg-opacity-50 p-4">
                  <h1 className="text-4xl font-bold text-white">
                    {featuredMovieTitle}
                  </h1>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded bg-gray-800 px-2 py-1 text-white">
                      {featuredMovie?.genreIds
                        ?.map((x: string) => {
                          const genre = genresData.find(
                            (y: any) => y.externalId === x,
                          );
                          return genre ? genre.name : "";
                        })
                        .filter((name) => name)
                        .join(", ")}
                    </span>
                    <span className="rounded bg-gray-800 px-2 py-1 text-white">
                    {new Date(featuredMovieRelease).getFullYear()}                    </span>
                    <span className="rounded bg-gray-800 px-2 py-1 text-white">
                      {"120 min"}
                    </span>
                    <span className="rounded bg-gray-800 px-2 py-1 text-white">
                    <Tag bordered={false} color="purple">
                    {featuredMovie?.mediaType?.toLowerCase()=='movie'? "Movie":"TV"}
                        </Tag>
                    </span>
                    
                    <span className="rounded bg-gray-800 px-2 py-1 text-white">
                      <FaStar className="mb-1 inline text-yellow-500" />{" "}
                      {Number(featuredMovie?.voteAverage?.toFixed(1))}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-6">
            {movies?.slice(1).map((movie, index) => {
              const title = movie.mediaType.toLowerCase() === "movie" ? movie.originalTitle : movie.name;
              const releaseDate = movie.mediaType.toLowerCase() === "movie" ? movie.releaseDate : movie.firstAirDate;

           
           return <div
                ref={lastMovieElementRef}
                key={index}
                className="flex flex-col items-start gap-4 rounded-md bg-white p-4 shadow-lg dark:bg-gray-800"
              >
                <Link
                  href={`watchnow/${movie.id}`}
                  className="flex items-center space-x-2 hover:text-blue-600"
                >
                  <img
                    src={`http://image.tmdb.org/t/p/w500/${movie?.posterPath}`}
                    alt={title}
                    className="h-60 w-80 rounded-md object-cover" // Increased height
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://icon-library.com/images/no-picture-available-icon/no-picture-available-icon-1.jpg"; // Fallback image
                      e.currentTarget.onerror = null; // Prevent infinite loop in case fallback image is also not found
                    }}
                  />
                </Link>
                <div className="w-100">
                  <h3 className="text-lg font-bold">
                    {" "}
                    <Tooltip title={title}>
                      {truncateString(title, 36)}
                    </Tooltip>
                  </h3>
                  <div className="flex items-center space-x-4">
                      <p className="text-sm">
                      { new Date(releaseDate).getFullYear()}
                    </p>
                   
                    <p className="flex items-center text-sm">
                      <FaStar className="mb-1 inline text-yellow-500" />{" "}
                      {Number(movie?.voteAverage.toFixed(1))}
                    </p>
                    <p className="text-sm">
                    <Tag bordered={false} color="purple">
                    {movie?.mediaType?.toLowerCase()=='movie'? "Movie":"TV"}
                        </Tag>
                      
                    </p>
                  </div>
                </div>
              </div>
})}
          </div>{" "}
        </>
      )}
    </>
  );
};
