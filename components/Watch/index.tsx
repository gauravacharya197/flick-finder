"use client";
import { getDetails } from "@/services/MovieService";
import { useParams } from "next/navigation";
import { useState } from "react";
import { PlayCircleOutlined } from "@ant-design/icons";
import VideoPlayer from "@/components/Player/VideoPlayer";
import { Skeleton, Alert } from "antd";
import { SimilarMovie } from "@/components/Movie/SimilarMovie";
import SeasonChooser from "./SeasonChooser";
import CastCard from "../Movie/CastCard";
import MovieDetails from "./MovieDetails";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import SectionHeader from "../Common/SectionHeader";
import ErrorMessage from "../Common/ErrorMessage";
import useMetadata from "@/hooks/useMetaData";
import { siteConfig } from "@/config/siteConfig";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";

const Watch = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const params = useParams();
  const { imdbID, mediaType } = params; // Extract the parameters
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedServer, setSelectedServer] = useState(1);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);

  if (!imdbID || !mediaType) {
    return <div>Error: Missing required parameters.</div>;
  }

  const {
    data: movieData,
    isLoading,
    isError,
    error,
  } = useQuery<AxiosResponse<any>>({
    queryKey: ["movieDetails", imdbID, mediaType],
    queryFn: () => getDetails(imdbID.toString(), mediaType.toString()),
    staleTime: 5 * 60 * 1000,
  });

  const movie = movieData?.data;
  useMetadata(
    `${siteConfig.siteName} - ${movie?.title ? ` Watch ${capitalizeFirstLetter(mediaType.toString())} ${movie?.title} Online` : "Watch Movies/TV Online"} `,
    "",
  );
  const constructUrl = (
    baseUrl: string,
    mediaType: any,
    imdbID: any,
    selectedSeason: number | null,
    selectedEpisode: number | null,
    separator = "-",
  ) => {
    if (
      mediaType === "tv" &&
      selectedSeason !== null &&
      selectedEpisode !== null
    ) {
      return `${baseUrl}/${mediaType}/${imdbID}${separator}${selectedSeason}${separator}${selectedEpisode}`;
    }
    return `${baseUrl}/${mediaType}/${imdbID}`;
  };

  const renderMovieScreen = () => {
    if (!isPlaying) {
      return (
        <div className="relative" style={{ width: "95%", height: "60vh" }}>
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
                setIsPlaying(true);
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
                    imdbID,
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
              "https://vidlink.pro",
              mediaType,
              imdbID,
              selectedSeason,
              selectedEpisode,
              "/",
            )}
          />
        );
      case 3:
        return (
          <VideoPlayer
            sourceUrl={`https://multiembed.mov/?video_id=${imdbID} ${
              imdbID.toString()?.startsWith("t") ? "" : "&tmdb=1"
            } ${
              mediaType == "tv"
                ? `&s=${selectedSeason}&e=${selectedEpisode}`
                : ""
            }`}
          />
        );
      case 4:
        return (
          <VideoPlayer
            sourceUrl={constructUrl(
              "https://v2.vidsrc.me/embed/",
              mediaType,
              imdbID,
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
    <>
      <div className="container">
        <div className="grid min-h-[200px] grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column */}
          <div className="col-span-2 rounded-lg">
            {isLoading ? (
              <Skeleton
                active
                paragraph={{
                  rows: 10,
                  width: [
                    "100%",
                    "100%",
                    "100%",
                    "100%",
                    "50%",
                    "50%",
                    "50%",
                    "50%",
                  ],
                }}
              />
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
                {renderMovieScreen()}

                <div className="mt-4 flex gap-4">
                  {[1, 2, 3, 4].map((server) => (
                    <button
                      key={server}
                      onClick={() => setSelectedServer(server)}
                      className={`rounded px-4 py-2 ${
                        selectedServer === server
                          ? "bg-primary"
                          : "bg-teal-500/35"
                      } text-white`}
                    >
                      Server {server}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  If the current server doesn't work, change the server
                </p>

                <br />

                <MovieDetails movie={movie} mediaType={mediaType} />
                <SectionHeader className="mb-5 mt-10 " text="Casts" />

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
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <div className="rounded-lg p-2 dark:text-white">
              {/* Always render SimilarMovie */}
              {mediaType === "movie" && (
                <SimilarMovie id={imdbID.toString()} mediaType={mediaType} />
              )}

              {/* Conditionally render SeasonChooser */}
              {mediaType === "tv" && !isLoading && !isError && (
                <SeasonChooser
                  seasons={movie?.seasons}
                  onSeasonChange={setSelectedSeason}
                  onEpisodeChange={setSelectedEpisode}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Watch;
