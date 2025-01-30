import React from "react";
import { StarOutlined, ClockCircleOutlined, CommentOutlined } from "@ant-design/icons";
import { FaHeart, FaBookmark, FaShareAlt, FaPlay } from "react-icons/fa";
import Link from "next/link";

const SingleMovieCard = ({ index, movie }) => {
  const liked = true;
  
  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
          <div className="relative md:col-span-1 group h-48 sm:h-64 md:h-full">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-t-none"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Link
                href={`watch/${movie.mediaType}/${movie.imdbID}`}
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full flex items-center space-x-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
              >
                <FaPlay className="text-xs sm:text-sm" />
                <span className="text-sm sm:text-base">Watch Now</span>
              </Link>
            </div>
          </div>

          <div className="md:col-span-2 p-3 sm:p-4 md:p-6 flex flex-col">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3">
              {movie.title}
            </h2>

            <div className="flex flex-wrap gap-2 sm:gap-4 mb-2 sm:mb-4 text-sm sm:text-base">
              <div className="flex items-center text-amber-500">
                <StarOutlined className="mr-1" />
                <span className="font-semibold">{movie.imdbRating}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <CommentOutlined className="mr-1" />
                <span>{movie.released}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <ClockCircleOutlined className="mr-1" />
                <span>{movie.runtime}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-4">
              {movie.genre.split(",").map((genre, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 sm:px-3 sm:py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs sm:text-sm"
                >
                  {genre.trim()}
                </span>
              ))}
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-2 sm:mb-4 text-sm sm:text-base line-clamp-2 sm:line-clamp-3">
              {movie.plot}
            </p>

            <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-6 text-xs sm:text-sm">
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Cast:</span> {movie.actors}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Director:</span> {movie.director}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold">Awards:</span> {movie.awards}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 sm:gap-6 mt-auto pt-2 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="flex items-center space-x-1 sm:space-x-2 text-gray-600 dark:text-gray-300 hover:text-teal-500 transition-colors duration-200 text-sm sm:text-base">
                <FaHeart className={`${liked ? "text-teal-500" : ""} text-xs sm:text-base`} />
                <span>Favorite</span>
              </button>
              <button className="flex items-center space-x-1 sm:space-x-2 text-gray-600 dark:text-gray-300 hover:text-teal-500 transition-colors duration-200 text-sm sm:text-base">
                <FaBookmark className="text-xs sm:text-base" />
                <span>Watch later</span>
              </button>
              <button className="flex items-center space-x-1 sm:space-x-2 text-gray-600 dark:text-gray-300 hover:text-teal-500 transition-colors duration-200 text-sm sm:text-base">
                <FaShareAlt className="text-xs sm:text-base" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleMovieCard;