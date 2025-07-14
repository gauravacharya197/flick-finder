import React, { useState } from "react";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { CustomTag } from "../common/CustomTag";
import { formatRating } from "@/utils/formatRating";
import { Movie } from "@/types/movie";
import { constructWatchUrl } from "@/utils/constructWatchUrl";
import { MyTooltip } from "../ui/MyTooltip";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [imageError, setImageError] = useState(false);
  const truncateString = (str: string, num: number) =>
    str?.length > num ? `${str.slice(0, num)}...` : str;
  
  const rating = formatRating(movie.voteAverage);
  const releaseYear = movie.displayReleaseDate ? new Date(movie.displayReleaseDate).getFullYear() : null;
  const watchUrl = constructWatchUrl(movie?.mediaType, movie?.id, movie?.displayTitle);
  
  // Determine image source with fallback
  const imageSrc = imageError 
    ? "https://icon-library.com/images/no-picture-available-icon/no-picture-available-icon-1.jpg"
    : movie.posterPath?.startsWith("http") 
      ? movie.posterPath 
      : `http://image.tmdb.org/t/p/w500/${movie.posterPath}`;

  return (
    <div className="group relative w-full max-w-sm mx-auto">
      {/* Card Container with consistent aspect ratio */}
      <div className="relative overflow-hidden rounded-xl bg-gray-900 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        
        {/* Image Container with fixed aspect ratio */}
        <div className="aspect-[2.2/2.8] w-full overflow-hidden relative">
          <Link 
            href={watchUrl}
            className="block absolute inset-0 z-10"
            aria-label={`View details for ${movie.displayTitle}`}
          >
            <span className="sr-only">View details for {movie.displayTitle}</span>
          </Link>
          
          <img
            src={imageSrc}
            alt={movie.displayTitle}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
          
          {/* Gradient overlays for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        
        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="space-y-3">
            {/* Title */}
            <MyTooltip content={movie.displayTitle}>
              <h3 className="text-lg font-bold text-white leading-tight line-clamp-2 drop-shadow-lg">
                {truncateString(movie.displayTitle, 28)}
              </h3>
            </MyTooltip>
           
            {/* Meta Information Container */}
            <div className="flex items-center justify-between gap-2 text-sm">
              {/* Left side - Release Year */}
              <div className="flex items-center">
                {releaseYear && (
                  <span className="text-gray-300 font-medium drop-shadow-md bg-black/20 px-2 py-1 rounded-md backdrop-blur-sm">
                    {releaseYear}
                  </span>
                )}
              </div>

              {/* Center - Rating */}
              <div className="flex items-center justify-center">
                {rating !== 0 && (
                  <div className="flex items-center space-x-1 bg-black/30 px-2 py-1 rounded-md backdrop-blur-sm">
                    <FaStar className="text-yellow-400 text-xs drop-shadow-md" aria-hidden="true" />
                    <span className="text-white font-medium drop-shadow-md">{rating}</span>
                  </div>
                )}
              </div>

              {/* Right side - Media Type */}
              <div className="flex items-center">
                {movie?.mediaType && (
                  <div className="transform scale-90">
                    <CustomTag text={movie.mediaType} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hover effect border */}
        <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-white/20 transition-colors duration-300" />
      </div>
    </div>
  );
};

export default React.memo(MovieCard);