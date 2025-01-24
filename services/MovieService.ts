import apiClient from '../axiosConfig';
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
export const getRecommendation = async (text: string) => {
  return await apiClient.post(`${baseUrl}api/Recommendation`, { text: text, delay: 0 }, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
export const getDetails = async (imdbID: string,mediaType:string) => {
  return await apiClient.get(`${baseUrl}api/Movies/details/${imdbID}/${mediaType}`)
};
export const getTrending = async (mediaType:string,timeWindow='day',pageNumber='1') => {
  return await apiClient.get(`${baseUrl}api/Movies/trending?mediaType=${mediaType}&timeWindow=${timeWindow}&pageNumber=${pageNumber}`)
};
export const getSimilarMovies = async (id:string,mediaType:string) => {
  return await apiClient.get(`${baseUrl}api/Movies/similar/${id}/${mediaType}`)
};
export const getFilters = async () => {
  return await apiClient.get(`${baseUrl}api/filters`)
};
export const discover = async (pageNumber=1, keyword = '',
  country = '',
  genre = '',
  year = '',
  mediaType='') => {
  // Destructure filters with default values as null


  // Construct query parameters
  const params = new URLSearchParams();
 params.append("pageNumber", pageNumber.toString());

  if (keyword) params.append("keyword", keyword);
  if (country) params.append("country", country);
  if (genre) params.append("genre", genre);
  if (year) params.append("year", year);

  if (mediaType) params.append("mediaType", mediaType);


  // Call the API with query parameters
  return await apiClient.get(`${baseUrl}api/movies/discover?${params.toString()}`);
};
