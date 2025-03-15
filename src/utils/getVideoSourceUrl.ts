// utils/videoSourceUtils.ts
import { VIDEO_SERVERS } from "@/constants/videoServers";

export function getVideoSourceUrl(
  selectedServer: number,
  mediaType: string,
  movie: any,
  selectedSeason: number | null,
  selectedEpisode: number | null
): string {
  // For server 1, use direct video source if available
  if (selectedServer === 0 && movie?.videoSource) {
   
    return movie.videoSource;
  }

  // Find the selected server config
  const server = VIDEO_SERVERS.find(s => s.id === selectedServer);
  if (!server) return "";
  const movieId = server.idType === "id" ? movie.id : movie.imdbID;

  // Get separator from server config or use default
  const separator = server.urlSeparator || '/';
  
  // Build URL based on content type
  if (mediaType === "tv" && selectedSeason !== null && selectedEpisode !== null) {
    return `${server.baseUrl}/${mediaType}/${movieId}${separator}${selectedSeason}${separator}${selectedEpisode}`;
  }
  
  return `${server.baseUrl}/${mediaType}/${movieId}`;
}