"use client";
import { discover, getPopular } from "@/services/MovieService";
import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { SearchFilter } from "../SearchFilter/SearchFilter";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { Segmented, Skeleton, Tag, Tooltip } from "antd";
import { FaStar } from "react-icons/fa";
import { truncateString } from "@/utils/truncateString";
import { AppstoreOutlined, BarsOutlined } from "@ant-design/icons";
import { setMediaType } from "@/redux/movies/advanceSearchSlice";

export const MovieList = ({ movies, lastMovieElementRef }) => {
  const { genres: genresData } = useSelector((state: any) => state.filters);

  const featuredMovie = movies?.[0];
  const featuredMovieTitle = featuredMovie?.displayTitle;
  const featuredMovieRelease = featuredMovie?.displayReleaseDate;
  return (
    <>
      {featuredMovie && (
        <div className="relative mb-8  w-full">
          <Link
            href={`watch/${featuredMovie?.mediaType}/${featuredMovie.id}`}
          >
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
                  {new Date(featuredMovieRelease).getFullYear()}{" "}
                </span>
                <span className="rounded bg-gray-800 px-2 py-1 text-white">
                  {"120 min"}
                </span>
                <span className="rounded bg-gray-800 px-2 py-1 text-white">
                  <Tag bordered={false} color="purple">
                    {featuredMovie?.mediaType?.toLowerCase() == "movie"
                      ? "Movie"
                      : "TV"}
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
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-4">
                  {movies?.slice(1).map((movie, index) => {
          return (
            <div
              ref={lastMovieElementRef}
              key={index}
              className="flex flex-col items-start gap-4 rounded-md bg-white p-4 shadow-lg dark:bg-gray-800"
            >
              <Link
                href={`watch/${movie?.mediaType}/${movie.id}`}
                className="flex items-center space-x-2 hover:text-blue-600"
              >
                <img
                  src={`http://image.tmdb.org/t/p/w500/${movie?.posterPath}`}
                  alt={movie?.displayTitle}
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
                  <Tooltip title={movie?.displayTitle}>
                    {truncateString(movie?.displayTitle, 36)}
                  </Tooltip>
                </h3>
                <div className="flex items-center space-x-4">
                  <p className="text-sm">
                    {new Date(movie?.displayReleaseDate).getFullYear()}
                  </p>

                  <p className="flex items-center text-sm">
                    <FaStar className="mb-1 inline text-yellow-500" />{" "}
                    {Number(movie?.voteAverage.toFixed(1))}
                  </p>
                  <p className="text-sm">
                    <Tag bordered={false} color="purple">
                      {movie?.mediaType?.toLowerCase() == "movie"
                        ? "Movie"
                        : "TV"}
                    </Tag>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
