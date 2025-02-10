"use client";
import { getDetails } from "@/services/MovieService";
import { useParams } from "next/navigation";
import { useState } from "react";
import { PlayCircleOutlined } from "@ant-design/icons";
import VideoPlayer from "@/components/Player/VideoPlayer";
import { Skeleton } from "antd";
import { SimilarMovie } from "@/components/Movie/SimilarMovie";
import SeasonChooser from "./SeasonChooser";
import CastCard from "../Movie/CastCard";
import MovieDetails from "./MovieDetails";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import SectionHeader from "../Common/SectionHeader";
import ErrorMessage from "../Common/ErrorMessage";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { FaShare } from "react-icons/fa";
import { constructUrl } from "@/utils/constructEmbedUrl";
import { useAuth } from "@/app/context/AuthContext";
import WatchlistButton from "./WatchListButton";
import { addToWatchHistory } from "@/utils/addToWatchHistory";
import { WatchPageProps } from "@/types/WatchPageProps";


const Watch = ({ params }: WatchPageProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { isLoggedIn, user } = useAuth();
  
  // Destructure params
  const { id, mediaType, title } = params; 
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedServer, setSelectedServer] = useState(1);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  if (!id || !mediaType) {
    return <div>Error: Missing required parameters</div>;
  }
  const {
    data: movieData,
    isLoading,
    isError,
    error,
  } = useQuery<AxiosResponse<any>>({
    queryKey: ["movieDetails", id, mediaType],
    queryFn: () => getDetails(id.toString(), mediaType.toString()),
    staleTime: 5 * 60 * 1000,
  });
  const movie = movieData?.data;
 
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
  const handlePlay = () => {
    setIsPlaying(true);

    // Add this line to save to watch history when user plays the video
    setTimeout(() => {
      addToWatchHistory(movie);
    }, 1); // 10 minutes in milliseconds
  };

  const renderMovieScreen = () => {
    if (!isPlaying) {
      return (
        <div className="relative" style={{ width: "100%", height: "65vh" }}>
          <img
            style={{ width: "100%", height: "100%", border: "none" }}
            className="rounded-md object-cover"
            src={
              movie?.coverImage ||
              movie?.poster ||
              "/images/user/failedtoload.jpg"
            }
          />
          {new Date(movie.released) <= new Date() && (
            <PlayCircleOutlined
              onClick={() => {
                handlePlay();
              }}
              className="absolute inset-0 m-auto text-6xl text-primary"
              style={{
                top: "50%",
                left: "65%",
                transform: "translate(-50%, -50%)",
              }}
            />
          )}
        </div>
      );
    }
    switch (selectedServer) {
      case 1:
        return (
          <VideoPlayer
            sourceUrl={
              movie?.videoSource
                ? movie.videoSource.startsWith("https://short.ink")
                  ? movie.videoSource
                  : baseUrl + "?source=" + movie.videoSource
                : constructUrl(
                    "https://moviesapi.club",
                    mediaType,
                    id,
                    selectedSeason,
                    selectedEpisode,
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
              id,
              selectedSeason,
              selectedEpisode,
              "/",
            )}
          />
        );
      case 3:
        return (
          <VideoPlayer
            sourceUrl={constructUrl(
              "https://vidlink.pro",
              mediaType,
              id,
              selectedSeason,
              selectedEpisode,
              "/",
            )}
          />
          
        );
      case 4:
        return (
          <VideoPlayer
            sourceUrl={constructUrl(
              "https://v2.vidsrc.me/embed/",
              mediaType,
              id,
              selectedSeason,
              selectedEpisode,
              "/",
            )}
          />
        );
      default:
        break;
    }
  };
  return (
    <div className=" ">
    <div className="grid min-h-[200px] grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Left Column */}
      <div className="col-span-2 rounded-lg">
        {isLoading ? (
          <div className="flex gap-3 rounded-lg bg-gray-100 p-3 dark:bg-gray-800/50">
            <Skeleton active className="h-24 w-16 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton active className="h-4 w-3/4" />
              <Skeleton active className="h-3 w-1/2" />
              <Skeleton active className="h-6 w-24" />
            </div>
          </div>
        ) : isError ? (
          <ErrorMessage
            className="mt-2 w-full"
            message={error?.message || "Something went wrong while fetching movie details."}
          />
        ) : (
          <div className="relative pb-[10.25%]">
            {renderMovieScreen()}
            <div className="flex flex-col gap-4 bg-[rgba(20,28,49,0.95)] p-4 text-white md:flex-row md:items-center md:justify-between">
              {/* Server selector */}
              <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-4">
                {[1, 2, 3, 4].map((server) => (
                  <button
                    key={server}
                    onClick={() => setSelectedServer(server)}
                    className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                      selectedServer === server
                        ? 'bg-primary text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Player {server}
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="hidden h-6 w-px bg-zinc-700 sm:block" />
                <div className="flex items-center justify-between gap-3">
                  <WatchlistButton
                    movieId={movie.id}
                    movie={movie}
                    isLoggedIn={isLoggedIn}
                    userId={user?.id}
                  />
                  <button
                    onClick={handleShare}
                    className="rounded-lg p-2 hover:bg-gray-800/50"
                  >
                    <FaShare className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            
            <p className="mt-2 text-sm text-gray-500">
              If the current player doesn't work, change the player
            </p>

            {/* Mobile-only SeasonChooser for TV shows */}
            {mediaType === "tv" && (
              <div className="mt-4 lg:hidden">
                <SeasonChooser
                  mediaId={id?.toString().startsWith("t") ? movie?.id : id}
                  seasons={movie?.seasons}
                  onSeasonChange={setSelectedSeason}
                  onEpisodeChange={setSelectedEpisode}
                />
              </div>
            )}

            <br />
            <MovieDetails movie={movie} mediaType={mediaType} />
            <SectionHeader className="mb-5 mt-10" text="Casts" />
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
              {movie?.casts?.map((character, index) => (
                <CastCard
                  key={index}
                  imgSrc={character.profilePath}
                  name={character.name}
                  role={character.character}
                />
              ))}
            </div>

            {/* Mobile-only SimilarMovie for movies */}
            {mediaType === "movie" && (
              <div className="mt-10 grid grid-cols-1  lg:hidden">
                <SimilarMovie 
                  id={id?.toString().startsWith("t") ? movie?.id : id} 
                  mediaType={mediaType}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Column - Only visible on desktop */}
      <div className="hidden space-y-8 lg:block">
        <div className="rounded-lg p-2 dark:text-white">
          {mediaType === "movie" && (
            <SimilarMovie 
              id={id?.toString().startsWith("t") ? movie?.id : id} 
              mediaType={mediaType} 
            />
          )}
          {mediaType === "tv" && !isLoading && !isError && (
            <SeasonChooser
              mediaId={id?.toString().startsWith("t") ? movie?.id : id}
              seasons={movie?.seasons}
              onSeasonChange={setSelectedSeason}
              onEpisodeChange={setSelectedEpisode}
            />
          )}
        </div>
      </div>
    </div>
  </div>

  );

};
export default Watch;
