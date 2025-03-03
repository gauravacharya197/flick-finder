// PlayerSection.tsx
import { FaPlay, FaServer, FaShare } from "react-icons/fa";
import VideoPlayer from "@/components/player/VideoPlayer";
import { constructUrl } from "@/utils/constructEmbedUrl";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import videoServers from "@/data/videoServers";
import { useState } from "react";
import WatchlistButton from "./WatchListButton";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { useAuth } from "@/app/context/AuthContext";
import { addToWatchHistory } from "@/utils/addToWatchHistory";
interface PlayerSectionProps {
  movie: any;
  mediaType: string;
  selectedSeason: number | null;
  selectedEpisode: number | null;
 }
const PlayerSection = ({
  movie,
  mediaType,
  selectedSeason,
  selectedEpisode,
}: PlayerSectionProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const handleShare = async () => {
    try {
      await navigator.share({
        title: movie?.title,
        text: `Watch ${capitalizeFirstLetter(mediaType.toString())} ${movie?.title} Online`,
        url: window.location.href,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };
  const { isLoggedIn, user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedServer, setSelectedServer] = useState(() => {
    // Try to get the stored value from localStorage on initial render
    const storedValue = localStorage.getItem("selectedServer");
    return storedValue ? parseInt(storedValue) : 1;
  });
  const handlePlay = () => {
    setIsPlaying(true);
    // Add this line to save to watch history when user plays the video
    setTimeout(
      () => {
        addToWatchHistory(movie);
      },
      10 * 60 * 1000
    ); // 10 minutes in milliseconds (10 * 60 seconds * 1000 milliseconds)
  };
  const renderPlayer = () => {
    if (!isPlaying) {
      return (
        <div className="relative w-full h-[40vh] sm:h-[70vh]  xl:h-[65vh]">
          <img
            className="w-full h-full rounded-md object-cover border-none"
            src={
              movie?.coverImage ||
              movie?.poster ||
              "/images/user/failedtoload.jpg"
            }
            alt={movie?.title || "Movie cover"}
          />
          {new Date(movie.released) <= new Date() && (
            <FaPlay
              onClick={handlePlay}
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
                  : `${movie.videoSource}`
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
              "https://player.autoembed.cc/embed/",
              mediaType,
              movie.imdbID,
              selectedSeason,
              selectedEpisode,
              "/"
            )}
            sandbox="allow-same-origin allow-scripts" // Block popups by not allowing them
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
            sourceUrl={constructUrl(
              "https://embed.su/embed",
              mediaType,
              movie.id,
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
  return (
    <div>
      {renderPlayer()}
      <div className="rounded-sm bg-gradient-to-r from-gray-800 to-gray-900 p-4 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          {/* Server Selection Section */}
          <div className="min-w-[140px]">
            <Select
              value={selectedServer.toString()}
              onValueChange={(value) => {
                setSelectedServer(parseInt(value));
                localStorage.setItem("selectedServer", value);
              }}
            >
              <SelectTrigger className="max-w-xs border-gray-700 bg-gray-800 ring-gray-700 lg:w-[200px] text-white">
                <div className="flex items-center gap-3">
                  <FaServer className="h-4 w-4 text-primary" />
                  <SelectValue placeholder="Choose Server" />
                </div>
              </SelectTrigger>
              <SelectContent className="border-gray-700 bg-gray-800 text-gray-100">
                <SelectGroup>
                  {videoServers.map((server, index) => (
                    <SelectItem
                      key={index}
                      value={server.id.toString()}
                      className="cursor-pointer data-[highlighted]:bg-gray-700 data-[highlighted]:text-white"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{server.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/* Controls Section */}
          {/* Controls Section */}
          <div className="flex items-center justify-between space-x-4 lg:justify-end">
            <div className="hidden h-8 w-px  lg:block" />
            <div className="flex items-center space-x-3">
              <WatchlistButton
                movieId={movie.id}
                movie={movie}
                isLoggedIn={isLoggedIn}
                userId={user?.id}
              />
              <button
                onClick={handleShare}
                className="group rounded-lg  p-2.5 transition-all hover:bg-gray-600"
                aria-label="Share"
              >
                <FaShare className="h-5 w-5 text-white transition-all group-hover:text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlayerSection;
