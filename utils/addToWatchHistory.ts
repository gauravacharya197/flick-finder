'use client'
interface WatchHistoryItem {
  id: string | number;
  displayTitle: string;
  displayReleaseDate?: string;
  posterPath: string;
  mediaType: string;
  voteAverage: number;
  watchedAt: string;
}

// Helper to check if we're in the browser
const isBrowser = () => typeof window !== 'undefined';

export const addToWatchHistory = (movie: any) => {
  if (!isBrowser()) return;
 
  try {
    const data = JSON.parse(localStorage.getItem('watchHistory') || '{"movies":[],"metadata":{"isPaused":false}}');
    
    // If history is paused, don't add new items
    if (data.metadata?.isPaused) {
      return;
    }

    const historyItem: WatchHistoryItem = {
      id: movie.id,
      displayTitle: movie.title,
      displayReleaseDate: movie.displayReleaseDate,
      posterPath: movie.poster,
      mediaType: movie.mediaType,
      voteAverage: movie.imdbRating,
      watchedAt: new Date().toISOString()
    };

    const existingMovies = Array.isArray(data.movies) ? data.movies : [];
    const updatedMovies = existingMovies.filter(item => item.id !== historyItem.id);
    updatedMovies.unshift(historyItem);
    const trimmedMovies = updatedMovies.slice(0, 50);

    localStorage.setItem('watchHistory', JSON.stringify({
      movies: trimmedMovies,
      metadata: data.metadata
    }));
  } catch (error) {
    console.error('Error saving to watch history:', error);
  }
};

export const getWatchHistory = (): WatchHistoryItem[] => {
  if (!isBrowser()) return [];
 
  try {
    const data = JSON.parse(localStorage.getItem('watchHistory') || '{"movies":[],"metadata":{"isPaused":false}}');
    return Array.isArray(data.movies) ? data.movies : [];
  } catch (error) {
    console.error('Error getting watch history:', error);
    return [];
  }
};

export const clearWatchHistory = () => {
  if (!isBrowser()) return;
 
  try {
    // Preserve the pause state when clearing
    const data = JSON.parse(localStorage.getItem('watchHistory') || '{"movies":[],"metadata":{"isPaused":false}}');
    localStorage.setItem('watchHistory', JSON.stringify({
      movies: [],
      metadata: data.metadata
    }));
  } catch (error) {
    console.error('Error clearing watch history:', error);
  }
};