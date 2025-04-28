// PlayerSection.tsx
import { FaPlay, FaShare } from "react-icons/fa";
import VideoPlayer from "@/components/player/VideoPlayer";
import { useState, useEffect } from "react";
import WatchlistButton from "./WatchListButton";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { useAuth } from "@/app/context/AuthContext";
import { addToWatchHistory } from "@/utils/addToWatchHistory";
import ServerSelector from "./ServerSelector";
import { getVideoSourceUrl } from "@/utils/getVideoSourceUrl";
import useDevToolsProtection from "@/hooks/useDevToolProtection";
import { VIDEO_SERVERS } from "@/constants/videoServers";

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

  const { isLoggedIn, user } = useAuth();
  const isReleased = new Date(movie.released) <= new Date();

  // Set isPlaying to true by default ONLY if the content is released
  const [isPlaying, setIsPlaying] = useState(isReleased);

  const [selectedServer, setSelectedServer] = useState(() => {
    // Try to get the stored value from localStorage on initial render
    // if (typeof window !== "undefined") {
    //   if(movie?.videoSource) {
    //     return 0;
    //   }}
    //   const storedValue = localStorage.getItem("selectedServer");
    //   return storedValue ? parseInt(storedValue) : 1;
    // }
    return 1;
  });

  //useDevToolsProtection(isPlaying);

  // Update localStorage when server changes
  useEffect(() => {
    if(selectedServer===0)return;
    localStorage.setItem("selectedServer", selectedServer.toString());
  }, [selectedServer]);

  // Add to watch history after 10 minutes (600000 ms) if content is released and playing
  useEffect(() => {
    let watchHistoryTimeout: NodeJS.Timeout;

    if (isReleased && isPlaying) {
      watchHistoryTimeout = setTimeout(() => {
        addToWatchHistory(movie);
      }, 1*1000*60*30); // 30 minutes
    }

    return () => {
      if (watchHistoryTimeout) {
        clearTimeout(watchHistoryTimeout);
      }
    };
  }, [isReleased, isPlaying, movie]);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: movie?.title,
        text: `Watch ${capitalizeFirstLetter(mediaType)} ${movie?.title} Online`,
        url: window.location.href,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handlePlay = () => {
    if (isReleased) {
      setIsPlaying(true);
    }
  };

  const handleServerChange = (serverId: number) => {
    if (selectedServer && window.umami) {
      // Send event to Google Analytics
      window.umami.track("server_selection", {
        category: "Server Interaction",
        label: `Server ${serverId}`,
        value: serverId,
      });
    }
    setSelectedServer(serverId);
  };

  const renderCoverImage = () => (
    <div className="relative w-full h-[40vh] sm:h-[70vh] xl:h-[72vh] 2xl:h-[65vh]">
      <img
        className="w-full h-full rounded-md object-cover border-none"
        src={
          movie?.coverImage || movie?.poster || "/images/user/failedtoload.jpg"
        }
        alt={movie?.title || "Movie cover"}
      />
      {isReleased ? (
        <button
          onClick={handlePlay}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/80 hover:bg-primary text-white p-6 rounded-full transition-all duration-300 transform hover:scale-110"
          aria-label="Play"
        >
          <FaPlay className="text-2xl" />
        </button>
      ) : (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-700/80 text-white p-4 rounded-lg text-center">
          <p className="font-semibold mb-1">Coming Soon</p>
          <p className="text-sm">Available {new Date(movie.released).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );

  return (
    <div>
      {!isPlaying ? (
        renderCoverImage()
      ) : (
        <VideoPlayer
          sourceUrl={getVideoSourceUrl(
            selectedServer,
            mediaType,
            movie,
            selectedSeason,
            selectedEpisode
          )}
          
        />
      )}

      <div className="rounded-sm bg-gradient-to-r from-gray-800 to-gray-900 p-2 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          {/* Server Selection Section */}
          <div className="min-w-[140px]">
            <ServerSelector
              servers={
                // movie?.videoSource
                //   ? [
                //       {
                //         id: 0,
                //         name: "Default",
                //         baseUrl: movie.videoSource,
                //         urlSeparator: "/",
                //       },
                //       ...VIDEO_SERVERS,
                //     ]
                   VIDEO_SERVERS
              }
              selectedServer={selectedServer}
              onServerChange={handleServerChange}
            />
          </div>

          {/* Controls Section */}
          <div className="flex items-center justify-between space-x-4 lg:justify-end">
            <div className="hidden h-8 w-px lg:block" />
            <div className="flex items-center space-x-3">
              <WatchlistButton
                movieId={movie.id}
                movie={movie}
                isLoggedIn={isLoggedIn}
                userId={user?.id}
              />
              <button
                onClick={handleShare}
                className="group rounded-lg p-2.5 transition-all hover:bg-gray-600"
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