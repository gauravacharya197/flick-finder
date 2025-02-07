import apiClient from '../axiosConfig';
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
export const getRecommendation = async (text: string) => {
  return await apiClient.post(`${baseUrl}api/Recommendation`, { text: text, delay: 0 }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
export const getMovies = async (category: string) => {
  return await apiClient.get(`${baseUrl}Movies/${category}`)
};
export const getDetails = async (imdbID: string, mediaType: string) => {
  return await apiClient.get(`${baseUrl}api/Movies/Details/${imdbID}/${mediaType}`)
};
export const getTrending = async (mediaType: string, timeWindow = 'day', pageNumber = '1') => {
  return await apiClient.get(`${baseUrl}api/Movies/Trending?mediaType=${mediaType}&timeWindow=${timeWindow}&pageNumber=${pageNumber}`)
};
export const getTopRated = async (mediaType: string, pageNumber = '1') => {
  return await apiClient.get(`${baseUrl}api/Movies/TopRated?mediaType=${mediaType}&pageNumber=${pageNumber}`)
};
export const getSimilarMovies = async (id: string, mediaType: string) => {
  return await apiClient.get(`${baseUrl}api/Movies/Similar/${id}/${mediaType}`)
};
export const getFilters = async () => {
  return await apiClient.get(`${baseUrl}api/Filters`)
};
export const discover = async (options: {
  pageNumber?: number;
  keyword?: string;
  country?: string;
  genre?: string;
  year?: number;
  mediaType?: string;
  sortBy?: string;
} = {}) => {
  const params = new URLSearchParams();

  // Set default pageNumber if not provided
  params.append("pageNumber", (options.pageNumber || 1).toString());

  if (options.keyword) params.append("keyword", options.keyword);
  if (options.country) params.append("country", options.country);
  if (options.genre) params.append("genre", options.genre);

  // Ignore year if sortBy is 'upcoming' or 'primary_release_date.desc'
  if (options.sortBy !== 'upcoming' && options.sortBy !== 'primary_release_date.desc' && options.year) {
    params.append("year", options.year.toString());
  }

  if (options.mediaType) params.append("mediaType", options.mediaType);
  if (options.sortBy) params.append("sortBy", options.sortBy);

  return await apiClient.get(`${baseUrl}api/movies/discover?${params.toString()}`);
};
