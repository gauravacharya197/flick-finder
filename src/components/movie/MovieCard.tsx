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
  const [imageLoaded, setImageLoaded] = useState(false);
  
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
    <div className="group relative w-full h-full">
      {/* Card Container with modern styling */}
      <div className="relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 shadow-xl transition-all duration-500 ease-out hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2 hover:scale-[1.02] border border-slate-700/50">
        
        {/* Image Container with optimized aspect ratio */}
        <div className="aspect-[3/4] w-full overflow-hidden relative group/image">
          <Link 
            href={watchUrl}
            className="block absolute inset-0 z-20"
            aria-label={`View details for ${movie.displayTitle}`}
          >
            <span className="sr-only">View details for {movie.displayTitle}</span>
          </Link>
          
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 animate-pulse" />
          )}
          
          <img
            src={imageSrc}
            alt={movie.displayTitle}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onError={() => setImageError(true)}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Enhanced gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 via-purple-900/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          
          {/* Top gradient for better contrast */}
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/50 to-transparent" />
        </div>
        
        {/* Top-right rating badge */}
        {rating !== 0 && (
          <div className="absolute top-3 right-3 z-10">
            <div className="flex items-center space-x-1 bg-black/70 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-yellow-400/30 shadow-lg">
              <FaStar className="text-yellow-400 text-xs drop-shadow-sm" aria-hidden="true" />
              <span className="text-white text-xs font-semibold">{rating}</span>
            </div>
          </div>
        )}

        {/* Media type badge */}
        {movie?.mediaType && (
          <div className="absolute top-3 left-3 z-10">
            <div className="transform scale-75 origin-top-left">
              <CustomTag text={movie.mediaType} />
            </div>
          </div>
        )}
        
        {/* Content overlay - more compact and modern */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="space-y-2">
            {/* Title with better typography */}
            <MyTooltip content={movie.displayTitle}>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight line-clamp-2 drop-shadow-lg tracking-tight">
                {truncateString(movie.displayTitle, 32)}
              </h3>
            </MyTooltip>
           
            {/* Compact year display */}
            {releaseYear && (
              <div className="flex items-center">
                <span className="text-slate-300 text-sm font-medium bg-black/30 backdrop-blur-sm px-2 py-1 rounded-md border border-white/10">
                  {releaseYear}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Modern hover effect with animated border */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-blue-400 group-hover:via-purple-400 group-hover:to-pink-400 transition-all duration-500" />
        
        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-xl" />
      </div>
    </div>
  );
};

export default React.memo(MovieCard);