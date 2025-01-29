"use client";
import Link from "next/link";
import React from "react";
import { FaPlay, FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Rating } from "../Common/Rating";

interface FeaturedMovieProps {
  movie: {
    mediaType: string;
    backdropPath: string;
    id: string;
    displayReleaseDate: string;
    genreIds: any;
    overview: string;
    voteAverage: string;
    displayTitle: string;
  };
}

const FeaturedMovie: React.FC<FeaturedMovieProps> = ({ movie }) => {
  const { genres: genresData } = useSelector((state: any) => state.filters);

  return (
    <div className="relative mb-5">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full bg-cover bg-center bg-no-repeat"
        style={{  backgroundPosition: "center 30%",

          backgroundImage: `url(http://image.tmdb.org/t/p/original/${movie?.backdropPath})`,
        }}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-20 h-full">
        <div className="container mx-auto h-full px-4 lg:px-8">
          <div className="max-w-4xl pt-32">
            <h1 className="mb-4 text-4xl font-bold md:text-6xl">
              {movie?.displayTitle}
            </h1>

            {/* Movie Info */}
            <div className="mb-4 flex flex-wrap items-center gap-4">
              <span className="rounded bg-primary px-2 py-1 text-xs">HD</span>
              {/* <span className="border border-gray-600 text-xs px-2 py-1 rounded">R</span> */}
              <div className="flex items-center">
                <span className="ml-1">
                  <Rating voteAverage={movie?.voteAverage} />
                </span>
              </div>
              <span>{movie?.displayReleaseDate}</span>
              {movie?.genreIds
                ?.map((x: string) => {
                  const genre = genresData.find((y: any) => y.externalId === x);
                  return genre ? genre.name : "";
                })
                .filter((name) => name)
                .map((genreName, index) => (
                  <span
                    key={index}
                    className="rounded bg-gray-800 px-2 py-1 text-xs text-white"
                  >
                    {genreName}
                  </span>
                ))}
              {/* {movie.genres.map((genre, index) => (
                <span key={index} className="text-sm">{genre}</span>
              ))} */}
            </div>

            <p className="mb-8 max-w-2xl text-sm text-gray-300 md:text-base">
              {movie?.overview}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href={`watch/${movie?.mediaType}/${movie?.id}`}
                className="flex items-center rounded-md bg-primary px-6 py-3 transition-colors hover:bg-primary-400 md:px-8"
              >
                <FaPlay className="mr-2 h-4 w-4" />
                Watch Now
              </Link>
              {/* <button className="border border-gray-600 hover:bg-gray-800 px-6 md:px-8 py-3 rounded-md flex items-center transition-colors">
    <FaPlus className="w-4 h-4 mr-2" />
    Favorite
  </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedMovie;
