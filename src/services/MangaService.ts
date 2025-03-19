
import apiClient from '../axiosConfig';
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  
 
  export const getManga = async (keyword?: string) => {
    return await apiClient.get(`${baseUrl}api/manga/trending`);
  };

   
  export const getMangaDetails = async (mangaId: string) => {
    return await apiClient.get(`${baseUrl}api/manga/Details/${mangaId}`);
  };