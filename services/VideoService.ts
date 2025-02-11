
import apiClient from "@/axiosConfig";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface Video {
  id: number;
  tmdbId?: string;
  imdbId?: string;
  videoSource: string;
}

export default class VideoService {
  static async getVideos(): Promise<Video[]> {
    const { data } = (await apiClient.get(`${baseUrl}api/videos`));
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
