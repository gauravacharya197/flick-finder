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
      : `http://image.tmdb.org/t/p/w400/${movie.posterPath}`;

  return (
    <div className="group relative overflow-hidden rounded-lg bg-gray-900 transition-transform duration-300 hover:shadow-lg">
      <Link 
        href={watchUrl}
        className="block aspect-[2.2/2.8] w-full overflow-hidden"
        aria-label={`View details for ${movie.displayTitle}`}
      >
        <div className="relative h-full w-full">
          {/* Image with Next.js Image optimization */}
          <div className="relative h-full w-full">
            <img
              src={imageSrc}
              alt={movie.displayTitle}
          
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          </div>
          
          {/* Gradient overlays - optimized with tailwind classes */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </Link>
      
      {/* Content - optimized layout */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="space-y-2">
          {/* Title */}
          <MyTooltip content={movie.displayTitle}>
            <h3 className="text-lg font-bold text-white drop-shadow-lg line-clamp-2">
              {truncateString(movie.displayTitle, 24)}
            </h3>
          </MyTooltip>
         
          {/* Meta Information - Improved layout structure */}
          <div className="flex items-center justify-between text-sm text-gray-200">
            {releaseYear && (
              <div className="flex items-center justify-center">
                <span className="drop-shadow-md">{releaseYear}</span>
              </div>
            )}

            {/* Flexible space between items */}
            <div className="flex-grow" />

            {/* Rating shown only when available */}
            {rating !== 0 && (
              <div className="flex items-center space-x-1">
                <FaStar className="text-yellow-500 drop-shadow-md" aria-hidden="true" />
                <span className="drop-shadow-md">{rating}</span>
              </div>
            )}

            {/* Flexible space between items */}
            <div className="flex-grow" />

            {/* Media Type Tag */}
            {movie?.mediaType && (
              <CustomTag text={movie.mediaType} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MovieCard);