'use client';
import React from 'react';
import { FaPlay, FaPlus } from 'react-icons/fa';

interface FeaturedMovieProps {
  movie: {
    mediaType: string;
    backdropPath: string;
    id: string;
    displayReleaseDate: string;
    genres: string[];
    overView: string;
    voteAverage: string;
    displayTitle:string;
  };
}

const FeaturedMovie: React.FC<FeaturedMovieProps> = ({ movie }) => {
  return (
    <div className="relative mb-15">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full"
        style={{
          backgroundImage: `url(${movie.backdropPath})`,
        }}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-20 h-full">
        <div className="container mx-auto px-4 lg:px-8 h-full">
          <div className="pt-32 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.displayTitle}</h1>

            {/* Movie Info */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="bg-cyan-500 text-xs px-2 py-1 rounded">cam</span>
              <span className="border border-gray-600 text-xs px-2 py-1 rounded">R</span>
              <div className="flex items-center">
                <span className="text-yellow-400">★</span>
                <span className="ml-1">{movie.voteAverage}</span>
              </div>
              <span>{movie.displayReleaseDate}</span>
             
              {movie.genres.map((genre, index) => (
                <span key={index} className="text-sm">{genre}</span>
              ))}
            </div>

            <p className="text-gray-300 mb-8 max-w-2xl text-sm md:text-base">
              {movie.overView}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="bg-cyan-500 hover:bg-cyan-600 px-6 md:px-8 py-3 rounded-md flex items-center transition-colors">
                <FaPlay className="w-4 h-4 mr-2" />
                Watch Now
              </button>
              <button className="border border-gray-600 hover:bg-gray-800 px-6 md:px-8 py-3 rounded-md flex items-center transition-colors">
                <FaPlus className="w-4 h-4 mr-2" />
                Favorite
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedMovie;
