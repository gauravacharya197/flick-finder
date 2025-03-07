
import apiClient from "@/axiosConfig";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default class PLayerService {
    static async getEmbedUrl(
        serverId: number, 
        imdbId: string, 
        mediaType: string, 
        season?: number | null, 
        episode?: number | null
      ) {
        return await apiClient.get(`${baseUrl}Player/Index`, {
          params: {
            serverId,
            imdbId,
            mediaType,
            season: season || null,
            episode: episode || null
          }
        });
      }
}
