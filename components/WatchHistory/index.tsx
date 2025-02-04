'use client';
import React, { useEffect, useState } from 'react';
import { Skeleton } from 'antd';
import { MovieList } from '../Movie/MovieList';
import { FaPause, FaPlay, FaSearch, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

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

  // Load watch history from localStorage
  const loadWatchHistory = () => {
    try {
      const data = localStorage.getItem('watchHistory');
      if (data) {
        const parsedData: WatchHistoryData | any[] = JSON.parse(data);
        if ('metadata' in parsedData) {
          setIsPaused(parsedData.metadata.isPaused);
          updateHistory(parsedData.movies);
        } else {
          updateHistory(parsedData);
        }
      }
    } catch (error) {
      console.error('Error loading watch history:', error);
    }
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

  // Save history with metadata
  const saveWatchHistory = (movies: any[], paused: boolean) => {
    localStorage.setItem('watchHistory', JSON.stringify({ movies, metadata: { isPaused: paused } }));
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

  // Clear watch history
  const handleClearHistory = () => {
  
      saveWatchHistory([], isPaused);
      setHistory({});
      setFilteredHistory({});
      toast.success("Watch history cleared successfuly",
        { position: "bottom-center" },
      );
  };

  // Toggle pause state
  const togglePause = () => {
    const newPaused = !isPaused;
    setIsPaused(newPaused);
    saveWatchHistory(Object.values(history).flat(), newPaused);
    toast.success(`Watch history ${newPaused? "paused":"resumed"} successfully`,
      { position: "bottom-center" },
    );
  };

  if (isLoading) return <Skeleton active className="container mx-auto px-4 py-8" />;

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
            <button onClick={togglePause} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary transition">
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
