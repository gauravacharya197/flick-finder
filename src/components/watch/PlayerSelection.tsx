// PlayerSection.tsx
import { FaPlay } from "react-icons/fa";
import VideoPlayer from "@/components/player/VideoPlayer";
import { constructUrl } from "@/utils/constructEmbedUrl";

interface PlayerSectionProps {
  movie: any;
  mediaType: string;
  isPlaying: boolean;
  selectedServer: number;
  selectedSeason: number | null;
  selectedEpisode: number | null;
  onPlay: () => void;
}

const PlayerSection = ({
  movie,
  mediaType,
  isPlaying,
  selectedServer,
  selectedSeason,
  selectedEpisode,
  onPlay,
}: PlayerSectionProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!isPlaying) {
    return (
<div className="relative w-full h-[40vh] sm:h-[70vh]">
<img
          className="w-full h-full rounded-md object-cover border-none"
          src={
            movie?.coverImage || movie?.poster || "/images/user/failedtoload.jpg"
          }
          alt={movie?.title || "Movie cover"}
        />
        {new Date(movie.released) <= new Date() && (
          <FaPlay
            onClick={onPlay}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl text-primary cursor-pointer"
          />
        )}
      </div>
    );
  }

  // Directly return VideoPlayer from switch case
  switch (selectedServer) {
    case 1:
      return (
        <VideoPlayer
          sourceUrl={
            movie?.videoSource
              ? movie.videoSource.startsWith("https://short")
                ? movie.videoSource
                : `${baseUrl}?source=${movie.videoSource}`
              : constructUrl(
                  "https://moviesapi.club",
                  mediaType,
                  movie.imdbID,
                  selectedSeason,
                  selectedEpisode
                )
          }
        />
      );
    case 2:
      return (
        <VideoPlayer
          sourceUrl={constructUrl(
            "https://embed.su/embed",
            mediaType,
            movie.imdbID,
            selectedSeason,
            selectedEpisode,
            "/"
          )}
        />
      );
    case 3:
      return (
        <VideoPlayer
          sourceUrl={constructUrl(
            "https://vidlink.pro",
            mediaType,
            movie.imdbID,
            selectedSeason,
            selectedEpisode,
            "/"
          )}
        />
      );
    case 4:
      return (
        <VideoPlayer
          sourceUrl={constructUrl(
            "https://v2.vidsrc.me/embed/",
            mediaType,
            movie.imdbID,
            selectedSeason,
            selectedEpisode,
            "/"
          )}
        />
      );
    case 5:
      return (
        <VideoPlayer
          sourceUrl={
            constructUrl(
            "https://player.autoembed.cc/embed/",
            mediaType,
            movie.imdbID,
            selectedSeason,
            selectedEpisode,
            "/"
          )}
        />
      );
    default:
      return <VideoPlayer sourceUrl="" />;
  }
};

export default PlayerSection;
