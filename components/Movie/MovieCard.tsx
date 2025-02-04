import React from "react";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { Tooltip } from "antd";
import { CustomTag } from "../Common/CustomTag";
import { formatRating } from "@/utils/formatRating";
import { Movie } from "@/types/movie";



interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const truncateString = (str: string, num: number) =>
    str?.length > num ? `${str.slice(0, num)}...` : str;

  return (
    <div className="group relative overflow-hidden rounded-lg bg-gray-900 transition-transform">
      <Link 
        href={`/watch/${movie.mediaType}/${movie.id}`} 
        className="block aspect-[2.2/2.8] w-full overflow-hidden"
      >
        <div className="relative h-full w-full">
          {/* Image */}
          
          <img
            src={movie.posterPath?.startsWith("http") 
              ? movie.posterPath 
              : `http://image.tmdb.org/t/p/w500/${movie.posterPath}`}
            alt={movie.displayTitle}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src =
                "https://icon-library.com/images/no-picture-available-icon/no-picture-available-icon-1.jpg";
              e.currentTarget.onerror = null;
            }}
          />
          {/* Permanent gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-90" />
          {/* Hover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </Link>
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="transform space-y-2">
          {/* Title */}
          <Tooltip title={movie.displayTitle}>
            <h3 className="text-lg font-bold text-white drop-shadow-lg">
              {truncateString(movie.displayTitle, 24)}
            </h3>
          </Tooltip>
          {/* Meta Information */}
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-200 xl:space-x-5 2xl:space-x-8">
      {/* Wrapper to ensure equal width and centered alignment */}
      <div className="flex items-center justify-center w-16 text-center">
        <span className="drop-shadow-md">
          {new Date(movie.displayReleaseDate).getFullYear()}
        </span>
      </div>

      {/* Divider */}
     

      {/* Rating Container */}
      {formatRating(movie.voteAverage) !== 0 &&
      <>
       <span className="h-4 w-px bg-gray-700" />
      <div className="flex items-center justify-center w-16 space-x-1">
        <FaStar className="text-yellow-500 drop-shadow-md" />
        <span className="drop-shadow-md">
         {formatRating(movie.voteAverage)}


        </span>
      </div>
      </>
       }

      {/* Divider */}
      <span className="h-4 w-px bg-gray-700" />

      {/* Media Type Container */}
      <div className="flex items-center justify-center w-16">
        <CustomTag 
          text={movie.mediaType.toLowerCase() === "movie" ? "Movie" : "TV"} 
        />
      </div>
    </div>

        </div>
      </div>
    </div>
  );
};

export default MovieCard;