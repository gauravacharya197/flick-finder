import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, memo } from 'react';
import { FaClock } from 'react-icons/fa';
import { CustomTag } from '../common/CustomTag';
import { Rating } from '../common/Rating';
import { constructWatchUrl } from '@/utils/constructWatchUrl';
import { formatDate } from '@/utils/formatDate';
import { Movie } from '@/types/movie'; // Assume this type exists

interface SimilarMovieCardProps {
  movie: Movie;
  index: number;
  mediaType: string;
}

export const SimilarMovieCard = memo(({ movie, index, mediaType }: SimilarMovieCardProps) => {
  const [imageError, setImageError] = useState(false);
  
  // Pre-compute values outside of JSX
  const watchUrl = constructWatchUrl(mediaType, movie.id, movie.displayTitle);
  const formattedDate = formatDate(movie?.displayReleaseDate);
  const imageSrc = imageError 
    ? "https://icon-library.com/images/no-picture-available-icon/no-picture-available-icon-1.jpg"
    : movie.posterPath?.startsWith("http") 
      ? movie.posterPath 
      : `https://image.tmdb.org/t/p/w200/${movie.posterPath}`;

  // Animation variants for performance
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3, 
        delay: Math.min(i * 0.05, 0.5) // Cap delay at 0.5s for better UX
      }
    })
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      custom={index}
      variants={cardVariants}
      key={movie.id}
      className="group relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-md"
      layout
    >
      <Link
        href={watchUrl}
        className="flex gap-3 p-3"
        aria-label={`View details for ${movie.displayTitle}`}
      >
        <div className="relative overflow-hidden rounded-md h-24 w-16 flex-shrink-0">
          <div className="relative h-full w-full">
            <Image
              src={imageSrc}
              alt={movie?.displayTitle || 'Movie poster'}
              fill
              sizes="64px"
              className="object-cover transform transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
              loading="lazy"
              placeholder="blur"
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-0 space-y-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-primary transition-colors">
            {movie?.displayTitle}
          </h3>
          
          {formattedDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <FaClock className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
              <span className="truncate">{formattedDate}</span>
            </div>
          )}
          
          <div className="flex flex-wrap items-center gap-2">
            {movie?.voteAverage ? <Rating voteAverage={movie.voteAverage} /> : null}
            {movie?.mediaType ? <CustomTag text={movie.mediaType} /> : null}
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

// Add display name for better debugging
SimilarMovieCard.displayName = 'SimilarMovieCard';