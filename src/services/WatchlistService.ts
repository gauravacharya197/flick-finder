
import apiClient from '../axiosConfig';
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
export const addToWatchlist = async (id, movie, userId) => {
    return await apiClient.post(`${baseUrl}api/watchlist`, {
      userId,
      tmdbId: id,
      content: JSON.stringify(movie),
    });
  };
  
  export const iswatchlisted = async (userId, tmdbId) => {
    return await apiClient.get(`${baseUrl}api/watchlist/is-watchlisted?userId=${userId}&mediaId=${tmdbId}`)
  };
  export const getUserWatchList = async () => {
    return await apiClient.get(`${baseUrl}api/watchlist`);
  };