
import apiClient from '../axiosConfig';
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  
 
export const getManga = async (keyword?: string) => {
  // If there's a search keyword, use the search endpoint
  if (keyword && keyword.trim()) {
    return await apiClient.get(`${baseUrl}api/manga/trending?search=${encodeURIComponent(keyword.trim())}`);
  }
  // Otherwise use the trending endpoint
  return await apiClient.get(`${baseUrl}api/manga/trending`);
};

   
  export const getMangaDetails = async (mangaId: string) => {
    return await apiClient.get(`${baseUrl}api/manga/Details/${mangaId}`);
  };