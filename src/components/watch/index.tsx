"use client";
import { getDetails } from "@/services/MovieService";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { SimilarMovie } from "@/components/movie/SimilarMovie";
import SeasonChooser from "./SeasonChooser";
import CastCard from "../movie/CastCard";
import MovieDetails from "./MovieDetails";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import SectionHeader from "../common/SectionHeader";
import ErrorMessage from "../common/ErrorMessage";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { FaServer, FaShare } from "react-icons/fa";
import { useAuth } from "@/app/context/AuthContext";
import WatchlistButton from "./WatchListButton";
import { addToWatchHistory } from "@/utils/addToWatchHistory";
import { WatchPageProps } from "@/types/WatchPageProps";
import Skeleton from "../common/Skeleton";
import videoServers from "../../data/videoServers";
import PlayerSection from "./PlayerSelection";
const Watch = ({ params }: WatchPageProps) => {
  const { isLoggedIn, user } = useAuth();

  // Destructure params
  const { id, mediaType, title } = params;
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedServer, setSelectedServer] = useState(() => {
    // Try to get the stored value from localStorage on initial render
    const storedValue = localStorage.getItem('selectedServer');
    return storedValue ? parseInt(storedValue) : 1;
  });
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
    }, 10 * 60 * 1000); // 10 minutes in milliseconds (10 * 60 seconds * 1000 milliseconds)
  };


  return (
    <div className="">
      <div className="grid min-h-[200px] grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Left Column - Now spans 3 columns instead of 2 */}
        <div className="col-span-3 rounded-lg">
          {isLoading ? (
            <>
              <div className="col-span-3 rounded-lg">
                {/* Main content area skeleton */}
                <div className="relative w-full h-[40vh] sm:h-[70vh]">

                  <div className="w-full h-full rounded-md animate-pulse bg-gray-700/30" />

                  {/* Center play button skeleton */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full animate-pulse bg-gray-700/30" />
                </div>

                {/* Additional content skeletons below the player */}
                <div className="mt-6 space-y-4">
                  {/* Title skeleton */}
                  <Skeleton showTitle={true} titleHeight="h-8" rows={0} />

                  {/* Description skeleton */}
                  <Skeleton
                    className="w-full"
                    showTitle={false}
                    rows={3}
                    rowHeight="h-4"
                    spacing="space-y-2"
                  />
                </div>

                {/* Right sidebar skeleton */}
              </div>
            </>
          ) : isError ? (
            <ErrorMessage
              className="mt-2 w-full"
              message={
                error?.message ||
                "Something went wrong while fetching movie details."
              }
            />
          ) : (
            <div className="relative pb-[10.25%]">
             <PlayerSection
              movie={movie}
              mediaType={mediaType}
              isPlaying={isPlaying}
              selectedServer={selectedServer}
              selectedSeason={selectedSeason}
              selectedEpisode={selectedEpisode}
              onPlay={handlePlay}
            />
              <div className="rounded-sm bg-gradient-to-r from-gray-800 to-gray-900 p-4 shadow-lg">
      <div className="flex items-center justify-between gap-4">
        {/* Server Selection Section */}
        <div className="min-w-[140px]">
          <Select
             value={selectedServer.toString()}
             onValueChange={(value) => {
              setSelectedServer(parseInt(value));
              localStorage.setItem('selectedServer', value);
            }}
          >
            <SelectTrigger className="max-w-xs border-gray-700 bg-gray-800 ring-black lg:w-[200px] text-white">
              <div className="flex items-center gap-3">
                <FaServer className="h-4 w-4 text-primary" />
                <SelectValue  placeholder="Choose Server" />
              </div>
            </SelectTrigger>
            <SelectContent className="border-gray-700 bg-gray-800 text-gray-100">
              <SelectGroup>
                {videoServers.map((server, index) => (
                  <SelectItem
                    key={index}
                    value={(server.id).toString()}
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
                {movie?.casts?.map((character: any, index: any) => (
                  <CastCard
                    key={index}
                    imgSrc={character.profilePath}
                    name={character.name}
                    role={character.character}
                    castId={character.id}
                  />
                ))}
              </div>

              {/* Mobile-only SimilarMovie for movies */}
              {mediaType === "movie" && (
                <div className="mt-10 grid grid-cols-1 lg:hidden">
                  <SimilarMovie
                    id={id?.toString().startsWith("t") ? movie?.id : id}
                    mediaType={mediaType}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Now spans 1 column */}
        <div className="hidden space-y-8 lg:block">
          <div className="rounded-lg  dark:text-white">
            {mediaType?.toLowerCase() === "movie" && (
              <SimilarMovie
                id={id?.toString().startsWith("t") ? movie?.id : id}
                mediaType={mediaType}
              />
            )}
            {mediaType?.toLowerCase() === "tv" && !isLoading && !isError && (
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
