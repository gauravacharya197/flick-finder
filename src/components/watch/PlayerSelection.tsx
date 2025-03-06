import { FaPlay, FaServer, FaShare } from "react-icons/fa";
import VideoPlayer from "@/components/player/VideoPlayer";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import videoServers from "@/data/videoServers";
import { useState, useEffect } from "react";
import { addToWatchHistory } from "@/utils/addToWatchHistory";
import { useQuery } from "@tanstack/react-query";
import WatchlistButton from "./WatchListButton";
import { useAuth } from "@/app/context/AuthContext";
import { shareContent } from "@/utils/shareContent";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";

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
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedServer, setSelectedServer] = useState(() => {
    const storedValue = localStorage.getItem("selectedServer");
    return storedValue ? parseInt(storedValue) : 1;
  });
  const { isLoggedIn, user } = useAuth();

  const handlePlay = () => {
    setIsPlaying(true);
    // Add to watch history after 10 minutes
    setTimeout(() => addToWatchHistory(movie), 10 * 60 * 1000);
  };

  // Fetch embed URL using React Query
  const { data: embedUrl, isLoading, error, refetch } = useQuery({
    queryKey: ['embedUrl', selectedServer, movie.imdbID, mediaType, selectedSeason, selectedEpisode],
    queryFn: async () => `${apiUrl}Player?server=${selectedServer}&id=${movie.imdbID}&mediaType=${mediaType}${
      selectedSeason ? `&season=${selectedSeason}` : ''
    }${selectedEpisode ? `&episode=${selectedEpisode}` : ''}`,
    enabled: isPlaying,
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  useEffect(() => {
    if (isPlaying) refetch();
  }, [selectedServer, selectedSeason, selectedEpisode, refetch, isPlaying]);
  
  return (
    <div className="flex flex-col bg-gray-900 rounded-lg overflow-hidden shadow-xl">
      {/* Player Area */}
      <div className="relative w-full h-[40vh] sm:h-[70vh] xl:h-[72vh] 2xl:h-[65vh] bg-black">
        {!isPlaying ? (
          <>
            <img
              className="w-full h-full object-cover opacity-80 transition-opacity"
              src={movie?.coverImage || movie?.poster || "/images/user/failedtoload.jpg"}
              alt={movie?.title || "Movie cover"}
            />
            {new Date(movie.released) <= new Date() && (
              <button 
                onClick={handlePlay}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/80 hover:bg-primary text-white p-6 rounded-full transition-all duration-300 transform hover:scale-110"
                aria-label="Play"
              >
                <FaPlay className="text-2xl" />
              </button>
            )}
          </>
        ) : isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
            <p className="text-red-400 mb-4">Failed to load video. Please try another server.</p>
            <button 
              onClick={() => refetch()} 
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <VideoPlayer 
            sourceUrl={embedUrl || ""} 
            {...(selectedServer === 2 ? { sandbox: "allow-same-origin allow-scripts" } : {})} 
          />
        )}
      </div>
      
      {/* Controls Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-gray-800 to-gray-900">
        <Select
          value={selectedServer.toString()}
          onValueChange={(value) => {
            setSelectedServer(parseInt(value));
            localStorage.setItem("selectedServer", value);
          }}
        >
              <SelectTrigger className="max-w-xs border-gray-700 bg-gray-800 ring-gray-700 lg:w-[200px] text-white">            <div className="flex items-center gap-2">
              <FaServer className="h-3 w-3 text-primary" />
              <SelectValue placeholder="Server" />
            </div>
          </SelectTrigger>
          <SelectContent className="border-gray-700 bg-gray-800 text-gray-100">
            <SelectGroup>
              {videoServers.map((server) => (
                <SelectItem
                  key={server.id}
                  value={server.id.toString()}
                  className="cursor-pointer data-[highlighted]:bg-gray-700 data-[highlighted]:text-white"
                >
                  {server.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        
        <div className="flex items-center space-x-2">
          <WatchlistButton
            movieId={movie.id}
            movie={movie}
            isLoggedIn={isLoggedIn}
            userId={user?.id}
          />
          <button
             onClick={() => 
              shareContent(
                movie?.title,
                `Watch ${capitalizeFirstLetter(mediaType)} ${movie?.title} Online`
              )
            }
            className="rounded-full p-2 text-white hover:bg-gray-700/50 transition-colors"
            aria-label="Share"
          >
            <FaShare className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerSection;