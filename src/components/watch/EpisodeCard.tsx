import { formatDate } from '@/utils/formatDate';
import React from 'react';
import { FaChevronDown, FaPlay, FaTv, FaCalendarAlt, FaStar } from 'react-icons/fa';

interface Episode {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  still_path: string;
  vote_average: number;
}

const EpisodeCard = ({ 
  episode, 
  isPlaying, 
  onClick 
}: { 
  episode: Episode;
  isPlaying: boolean;
  onClick: () => void;
}) => {
  const today = new Date();
  const airDate = new Date(episode.air_date);
  const isReleased = airDate <= today;

  return (
    <button
      onClick={isReleased ? onClick : undefined}
      disabled={!isReleased}
      className={`w-full p-3 rounded transition-all duration-200 
        ${isReleased 
          ? `${isPlaying ? 'bg-gray-100/10' : 'bg-transparent'} hover:bg-gray-100/5` 
          : 'bg-gray-800/20 cursor-not-allowed opacity-75'}`}
    >
      <div className="flex gap-4">
        <div className="relative w-24 h-16 flex-shrink-0 rounded overflow-hidden">
          {episode.still_path ? (
            <>
              <img
                src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                alt={episode.name}
                className={`w-full h-full object-cover ${!isReleased && 'grayscale'}`}
              />
              {isReleased && (
                <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors duration-200 flex items-center justify-center">
                  <FaPlay className="w-4 h-4 text-white opacity-0 hover:opacity-100 transition-opacity" />
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <FaPlay className="w-4 h-4 text-gray-600" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-4 mb-2">
            <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400">
              Ep {episode.episode_number}
            </span>
           
            {!isReleased && (
              <span className="text-blue-400 text-xs font-medium">Upcoming</span>
            )}
          </div>
          
          <h3 className="font-medium text-sm truncate">
            {episode.name}
          </h3>
          
          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
            <FaCalendarAlt className="w-3 h-3" />
            <span>{formatDate(episode.air_date)}</span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default EpisodeCard;