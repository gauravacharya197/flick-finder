'use client';
import React, { useEffect, useState } from 'react';
import { MovieList } from '../movie/MovieList';
import { FaPause, FaPlay, FaSearch, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { addToWatchHistory,getWatchHistory, clearWatchHistory, setPauseState } from '@/utils/addToWatchHistory';

// Interface for watch history with metadata
interface WatchHistoryData {
  movies: any[];
  metadata: { isPaused: boolean };
}

const WatchHistory = () => {
  const [history, setHistory] = useState<Record<string, any[]>>({});
  const [filteredHistory, setFilteredHistory] = useState<Record<string, any[]>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWatchHistory();
  }, []);

  // Load watch history using the helper function
  const loadWatchHistory = () => {
    const { movies, isPaused } = getWatchHistory();  // Destructure both movies and pause state
    if (movies.length > 0) {
      
      updateHistory(movies);  // Update the history in state
    }
    setIsPaused(isPaused);  // Set the pause state
    setIsLoading(false);
  };

  // Group movies by watch date and update state
  const updateHistory = (movies: any[]) => {
    const groupedHistory = movies.reduce((acc: Record<string, any[]>, movie) => {
      const date = new Date(movie.watchedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      acc[date] = acc[date] ? [...acc[date], movie] : [movie];
      return acc;
    }, {});
    setHistory(groupedHistory);
    setFilteredHistory(groupedHistory);
  };

  // Handle search input
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) return setFilteredHistory(history);

    const filtered = Object.fromEntries(
      Object.entries(history).map(([date, movies]) => [
        date,
        movies.filter(movie => movie.displayTitle.toLowerCase().includes(query.toLowerCase())),
      ]).filter(([_, movies]) => movies.length > 0)
    );

    setFilteredHistory(filtered);
  };

  // Handle clearing watch history using the helper function
  const handleClearHistory = () => {
    clearWatchHistory();
    setHistory({});
    setFilteredHistory({});
    toast.success("Watch history cleared successfully", { position: "bottom-center" });
  };

  // Toggle pause state and update history using the helper function
  const togglePause = () => {
    const newPaused = !isPaused;
    setIsPaused(newPaused);
    setPauseState(newPaused); // Update pause state in storage
    toast.success(`Watch history ${newPaused ? "paused" : "resumed"} successfully`, { position: "bottom-center" });
  };

  if (isLoading) return <></>;

  return (
    <div className="mx-auto py-2">
    
      {/* Header Section */}
      <div className="p-4 mb-8 shadow-lg">
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full sm:w-96">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search in history..."
              className="w-full rounded-lg py-2 pl-10 pr-4 border-gray-300 bg-white text-black placeholder-gray-500 
                        focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button onClick={handleClearHistory} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition">
              <FaTrash size={14} />
              <span className="text-sm font-medium">Clear</span>
            </button>
            <button onClick={togglePause} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white transition">
              {isPaused ? <FaPlay size={14} /> : <FaPause size={14} />}
              <span className="text-sm font-medium">{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Watch History Content */}
      <div className="space-y-8">
        {Object.keys(filteredHistory).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-3 px-4">
            <div className="rounded-lg p-6 text-center max-w-md">
              <p className="text-lg">{searchQuery ? '🔍 No matches found' : '📹 Your watch history is empty'}</p>
              <p className="text-sm mt-2">{searchQuery ? 'Try adjusting your search terms' : 'Movies you watch will appear here'}</p>
            </div>
          </div>
        ) : (
          Object.entries(filteredHistory).map(([date, movies]) => (
            <div key={date} className="relative">
              {/* Date Header */}
              <div className="sticky top-0 z-10 bg-gradient-to-b from-background to-background/80 pb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <h2 className="text-lg font-medium text-gray-200">{date}</h2>
                  </div>
                  <div className="h-[1px] flex-grow bg-gradient-to-r from-gray-700 to-transparent"></div>
                </div>
              </div>

              {/* Movies Grid */}
              <div className="mt-4 rounded-lg overflow-hidden">
                <MovieList movies={movies} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WatchHistory;
