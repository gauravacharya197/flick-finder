"use client";
import Link from "next/link";
import React from "react";
import { FaPlay, FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Rating } from "../common/Rating";
import { formatDate } from "@/utils/formatDate";
import { constructWatchUrl } from "@/utils/constructWatchUrl";
import { CustomTag } from "../common/CustomTag";

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
        style={{
          backgroundPosition: "center 30%",
          backgroundImage: `url(http://image.tmdb.org/t/p/original/${movie?.backdropPath})`,
        }}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-20 h-full">
        <div className="px-4 lg:px-12 2xl:px-48">
          <div className="max-w-4xl pt-50 "> {/* Changed pt-32 to pt-40 and added pb-24 */}
            <h1 className="mb-4 text-4xl font-bold md:text-6xl">
              {movie?.displayTitle}
            </h1>

            {/* Movie Info */}
            <div className="mb-4 flex flex-wrap items-center gap-4">
              <CustomTag 
                        text={movie?.mediaType} 
                      />
              <div className="flex items-center">
                <span className="ml-1">
                  <Rating voteAverage={movie?.voteAverage} />
                </span>
              </div>
              <span>{formatDate(movie?.displayReleaseDate)}</span>
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
            </div>

            <p className="mb-8 max-w-2xl text-sm text-gray-300 md:text-base">
              {movie?.overview}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href={constructWatchUrl(movie?.mediaType, movie?.id,movie?.displayTitle)}
                className="flex items-center rounded-md bg-primary px-6 py-3 transition-colors hover:bg-primary-400 md:px-8"
              >
                <FaPlay className="mr-2 h-4 w-4" />
                Watch Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedMovie;