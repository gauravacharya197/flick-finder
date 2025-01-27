import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Tag, Tooltip } from "antd";
import { FaStar } from "react-icons/fa";
import { truncateString } from "@/utils/truncateString";
import { CustomTag } from "../Common/CustomTag";
import MovieCard from "./MovieCard";

interface MovieListProps {
  movies: any[];
  showFeaturedMovie?: boolean; // Optional prop to control the featured movie display
}

export const MovieList = ({ movies, showFeaturedMovie = false }: MovieListProps) => {
  const { genres: genresData } = useSelector((state: any) => state.filters);

  const featuredMovie = movies?.[0];
  const featuredMovieTitle = featuredMovie?.displayTitle;
  const featuredMovieRelease = featuredMovie?.displayReleaseDate;

  // If showFeaturedMovie is false, start the list from the second movie
  const movieList = showFeaturedMovie ? movies?.slice(1) : movies;

  return (
    <>
      {showFeaturedMovie && featuredMovie && (
        <div className="relative mb-8 w-full">
          <Link href={`watch/${featuredMovie?.mediaType}/${featuredMovie.id}`}>
            <img
              src={`http://image.tmdb.org/t/p/original/${featuredMovie?.backdropPath}`}
              alt={featuredMovieTitle}
              className="h-full w-full rounded-md object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src =
                  "https://icon-library.com/images/no-picture-available-icon/no-picture-available-icon-1.jpg"; // Fallback image
                e.currentTarget.onerror = null; // Prevent infinite loop in case fallback image is also not found
              }}
            />
            <div className="absolute inset-0 flex flex-col justify-end rounded-md bg-black bg-opacity-50 p-4">
              <h1 className="text-4xl font-bold text-white">{featuredMovieTitle}</h1>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded bg-gray-800 px-2 py-1 text-white">
                  {featuredMovie?.genreIds
                    ?.map((x: string) => {
                      const genre = genresData.find((y: any) => y.externalId === x);
                      return genre ? genre.name : "";
                    })
                    .filter((name) => name)
                    .join(", ")}
                </span>
                <span className="rounded bg-gray-800 px-2 py-1 text-white">
                  {new Date(featuredMovieRelease).getFullYear()}{" "}
                </span>
                <span className="rounded bg-gray-800 px-2 py-1 text-white">
                  {"120 min"}
                </span>
                <span className=" bg-gray-800 px-2 py-1 text-white">
                 
                  <CustomTag text={featuredMovie?.mediaType?.toLowerCase() === "movie" ? "Movie" : "TV"} />
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

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-4">
      {movieList?.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
      </div>
    </>
  );
};
