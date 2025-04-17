// utils/videoSourceUtils.ts
import { VIDEO_SERVERS } from "@/constants/videoServers";

export function getVideoSourceUrl(
  selectedServer: number,
  mediaType: string,
  movie: any,
  selectedSeason: number | null,
  selectedEpisode: number | null
): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // For server 1, use direct video source if available
  if(selectedServer===0){
  if (mediaType.toLowerCase() === "movie" && movie.videoSource) {
    return `${baseUrl}player?mediaType=movie&movieId=${movie.id}&imdbId=${ movie.imdbID}`;
  }

  // For TV Shows: Check if videoSource is true, then construct API URL
  if (mediaType.toLowerCase() === "tv" && movie.videoSource) {
    if (!selectedSeason || !selectedEpisode) return "";

    return `${baseUrl}player?mediaType=tv&movieId=${movie.id || movie.imdbID}&season=${selectedSeason}&episode=${selectedEpisode}`;
  }
}

  // Find the selected server config
  const server = VIDEO_SERVERS.find(s => s.id === selectedServer);
  if (!server) return "";
  const movieId = server.idType === "id" ? movie.id : movie.imdbID;

  // Get separator from server config or use default
  const separator = server.urlSeparator || '/';

  // Build URL based on content type
  if (mediaType === "tv" && selectedSeason !== null && selectedEpisode !== null) {
    return `${server.baseUrl}/${mediaType}/${movieId}${separator}${selectedSeason}${separator}${selectedEpisode}?poster=${movie?.coverImage}&theme=${'14b8a6'}&title=${movie?.displayTitle}`;
  }
  return `${server.baseUrl}/${mediaType}/${movieId}?poster=${movie?.coverImage}&theme=${'14b8a6'}&title=${movie?.displayTitle}`;
}