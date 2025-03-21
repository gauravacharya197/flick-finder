"use client";
import { getDetails } from "@/services/MovieService";
import { useState } from "react";
import { SimilarMovie } from "@/components/movie/SimilarMovie";
import SeasonChooser, { EpisodeLoading } from "./SeasonChooser";
import CastCard from "../movie/CastCard";
import MovieDetails from "./MovieDetails";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import SectionHeader from "../common/SectionHeader";
import ErrorMessage from "../common/ErrorMessage";
import { WatchPageProps } from "@/types/WatchPageProps";
import Skeleton from "../common/Skeleton";
import PlayerSection from "./PlayerOptions";
const Watch = ({ params }: WatchPageProps) => {
  // Destructure params
  const { id, mediaType, title } = params;
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

  return (
    <div>
      <div className="grid min-h-[200px] grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Left Column - Now spans 3 columns instead of 2 */}
        <div className="col-span-3 rounded-lg">
          {isLoading ? (
            <>
              <div className="col-span-3 rounded-lg">
                {/* Main content area skeleton */}
                <div className="relative w-full h-[40vh] sm:h-[70vh]  xl:h-[65vh]">
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
                                    <Skeleton showTitle={true} titleHeight="h-8" rows={0} />

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
                mediaType={mediaType?.toLowerCase()}
                selectedSeason={selectedSeason}
                selectedEpisode={selectedEpisode}
              />
              <p className="mt-2 text-sm text-gray-500">
              If the current server doesn't work, try switching to a different one.
              </p>
              {/* Mobile-only SeasonChooser for TV shows */}
              {mediaType?.toLowerCase() === "tv" && (
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
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {movie?.casts && movie.casts.length > 0 ? (
  movie?.casts?.map((character, index) => (
    
    <CastCard
      key={index}
      index={index}
      imgSrc={character.profilePath}
      name={character.name}
      role={character.character}
      castId={character.id}
    />
  ))
) : (
  <p>No cast available</p>
)}
              </div>
              {/* Mobile-only SimilarMovie for movies */}
              {mediaType?.toLowerCase() === "movie" && (
                <div className="mt-10 grid grid-cols-1 lg:hidden">
                  <SimilarMovie
                    id={id?.toString().startsWith("t") ? movie?.id : id}
                    mediaType={mediaType?.toLowerCase()}
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
                mediaType={mediaType?.toLowerCase()}
              />
            )}
            {mediaType?.toLowerCase() === "tv" ? (
              isLoading ? (
                Array.from({ length: 7 }).map((_, index) => (
                  <EpisodeLoading key={index} />
                ))
              ) : (
                <SeasonChooser
                  mediaId={id?.toString().startsWith("t") ? movie?.id : id}
                  seasons={movie?.seasons}
                  onSeasonChange={setSelectedSeason}
                  onEpisodeChange={setSelectedEpisode}
                />
              )
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Watch;
