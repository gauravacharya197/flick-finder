import apiClient from '../axiosConfig';
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const Search = async (query: string) => {
  return await apiClient.get(`${baseUrl}api/Anime/search?query=${query}`)
};
