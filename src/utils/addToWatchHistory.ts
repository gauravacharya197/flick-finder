import { Movie } from '@/types/movie';
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;

// Helper to check if we're in the browser
const isBrowser = () => typeof window !== 'undefined';

// Types for history data
interface LocalMovie extends Movie {
  
  watchedAt: string;
}

interface WatchHistory {
  movies: LocalMovie[];
  metadata: { isPaused: boolean };
}

// Encrypt function
const encryptData = (data: any): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

// Decrypt function
const decryptData = (cipherText: string): any => {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedData ? JSON.parse(decryptedData) : null;
};

// Save to watch history with encryption
export const addToWatchHistory = (movie: LocalMovie): void => {
  if (!isBrowser()) return;
  console.log('watch histor', movie);
  
  try {
    const data = localStorage.getItem('watchHistory');
    let parsedData: WatchHistory = { movies: [], metadata: { isPaused: false } };

    if (data) {
      parsedData = decryptData(data);
    }

    // If history is paused, don't add new items
    if (parsedData.metadata?.isPaused) {
      return;
    }

    const historyItem = {
      id: movie.id,
      displayTitle: movie.displayTitle,
      displayReleaseDate: movie.displayReleaseDate,
      posterPath: movie.posterPath,
      mediaType: movie.mediaType.toLowerCase(),
      voteAverage: movie.voteAverage,
      watchedAt: new Date().toISOString()
    };

    const updatedMovies = parsedData.movies.filter(item => item.id !== historyItem.id);
    updatedMovies.unshift(historyItem);
    const trimmedMovies = updatedMovies.slice(0, 50);
    console.log(historyItem);
    
    localStorage.setItem('watchHistory', encryptData({
      movies: trimmedMovies,
      metadata: parsedData.metadata
    }));
  } catch (error) {
    console.error('Error saving to watch history:', error);
  }
};

// Get watch history with decryption
export const getWatchHistory = (): { movies: Movie[]; isPaused: boolean } => {
  if (!isBrowser()) return { movies: [], isPaused: false };

  try {
    const data = localStorage.getItem('watchHistory');
    if (!data) return { movies: [], isPaused: false };

    const parsedData = decryptData(data);
    return { movies: parsedData.movies || [], isPaused: parsedData.metadata?.isPaused ?? false };
  } catch (error) {
    console.error('Error getting watch history:', error);
    return { movies: [], isPaused: false };
  }
};

// Clear watch history with encryption (preserve pause state)
export const clearWatchHistory = (): void => {
  if (!isBrowser()) return;

  try {
    const data = localStorage.getItem('watchHistory');
    let parsedData: WatchHistory = { movies: [], metadata: { isPaused: false } };

    if (data) {
      parsedData = decryptData(data);
    }

    // Preserve pause state while clearing the history
    localStorage.setItem('watchHistory', encryptData({
      movies: [],
      metadata: parsedData.metadata
    }));
  } catch (error) {
    console.error('Error clearing watch history:', error);
  }
};

// Set pause state in watch history
export const setPauseState = (isPaused: boolean): void => {
  if (!isBrowser()) return;

  try {
    const data = localStorage.getItem('watchHistory');
    let parsedData: WatchHistory = { movies: [], metadata: { isPaused: false } };

    if (data) {
      parsedData = decryptData(data);
    }

    parsedData.metadata.isPaused = isPaused;

    localStorage.setItem('watchHistory', encryptData(parsedData));
  } catch (error) {
    console.error('Error setting pause state:', error);
  }
};
