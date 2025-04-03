
import apiClient from "@/axiosConfig";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface Video {
  id: number;
  title: string;
  tmdbId?: string;
  imdbId?: string;
  videoSource: string;
  mediaType?: string; // New field
  seasons?: number; // New field
  episode?: number; // New field
  uploaded?: string | null | undefined; // New field

}

export default class VideoService {
  static async getVideos(
    options: {
      searchQuery?: string;
      pageNumber?: string;
      sortDescending?: boolean;
    } = {}
  ){
    const { searchQuery, pageNumber, sortDescending = true } = options;
    
    // Start with base URL
    const url = new URL(`${baseUrl}api/videos`);
    
    // Add query parameters if they exist
    if (searchQuery) {
      url.searchParams.append('search', searchQuery);
    }
    
    if (pageNumber) {
      url.searchParams.append('pageNumber', pageNumber);
    }
    
    url.searchParams.append('sortDescending', sortDescending.toString());
    
    const { data } = await apiClient.get(url.toString());
    return data;
  }


  static async addVideo(newVideo: Partial<Video>) {
    return await  apiClient.post(`${baseUrl}api/videos`, newVideo);
  }

  static async updateVideo(updatedVideo: Video) {
    return await apiClient.put(`${baseUrl}api/videos/${updatedVideo.id}`, updatedVideo);
  }

  static async deleteVideo(id: number) {
    return await apiClient.delete(`${baseUrl}api/videos/${id}`);
  }
}
