import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react'
import { FaClock } from 'react-icons/fa';
import { CustomTag } from '../Common/CustomTag';
import { Rating } from '../Common/Rating';

export const SimilarMovieCard = ({movie,index,mediaType}) => {
  return (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
    key={movie.id}
    className="group relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-md"
  >
    <Link
      href={`/watch/${mediaType}/${movie.id}`}
      className="flex gap-3 p-3"
    >
      <div className="relative overflow-hidden rounded-md">
        <img
          src={movie.posterPath?.startsWith("http") 
            ? movie.posterPath 
            : `http://image.tmdb.org/t/p/w500/${movie.posterPath}`}
          alt={movie?.title}
          className="h-24 w-16 object-cover transform transition-transform group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "https://icon-library.com/images/no-picture-available-icon/no-picture-available-icon-1.jpg";
            e.currentTarget.onerror = null;
          }}
        />
      </div>
      
      <div className="flex-1 space-y-1">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-primary transition-colors">
          {movie?.displayTitle}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <FaClock className="w-3 h-3" />
          <span>{movie?.displayReleaseDate}</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Rating voteAverage={movie?.voteAverage}/>
          <CustomTag text={movie?.mediaType} />
        </div>
      </div>
    </Link>
  </motion.div>
  )
}
