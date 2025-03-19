
import apiClient from '../axiosConfig';
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  
 
export const getManga = async (keyword?: string, page: number = 1) => {
  // Build the URL with pagination
  let url = `${baseUrl}api/manga/trending?page=${page}`;
  
  // Add search parameter if provided
  if (keyword && keyword.trim()) {
    url += `&search=${encodeURIComponent(keyword.trim())}`;
  }
  
  // Make the API call
  return await apiClient.get(url);
};

   
  export const getMangaDetails = async (mangaId: string) => {
    return await apiClient.get(`${baseUrl}api/manga/Details/${mangaId}`);
  };