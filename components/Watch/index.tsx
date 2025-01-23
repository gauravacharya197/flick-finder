"use client";
import { getDetails } from "@/services/MovieService";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { PlayCircleOutlined } from "@ant-design/icons";
import VideoPlayer from "@/components/Player/VideoPlayer";
import { Skeleton, Spin, Tag } from "antd";
import { SimilarMovie } from "@/components/Movie/SimilarMovie";
import { FaStar } from "react-icons/fa";
import { CustomTag } from "../Common/CustomTag";
import SeasonChooser from "./SeasonChooser";
import toast from "react-hot-toast";
import useFetch from "@/hooks/useFetch";
import useMetadata from "@/hooks/useMetaData";
import CastCard from "../Movie/CastCard";
import { getSourceIcon } from "@/utils/getSourceIcon";
import { siteConfig } from "@/config/siteConfig";
import MovieDetails from "./MovieDetails";

const Watch = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const params = useParams();
  const { imdbID, mediaType } = params; // Extract the parameters
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedServer, setSelectedServer] = useState(1);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);
  // Dummy movie data
  if (!imdbID || !mediaType) {
    return <div>Error: Missing required parameters.</div>;
  }
  const {
    data: movie,
    loading,
    error,
  } = useFetch(
    () =>
      getDetails(imdbID.toString(), mediaType.toString()).then(
        (res) => res.data,
      ),
    [imdbID, mediaType],
  );
  useMetadata(
    ` ${movie?.title ? `Watch ${movie?.title} Full ${mediaType.toString().toUpperCase()} Online` : siteConfig.title}`,
    siteConfig.description,
  );

  const constructUrl = (
    baseUrl: string,
    mediaType: any,
    imdbID: any,
    selectedSeason: number | null,
    selectedEpisode: number | null,
    seperator = "-",
  ) => {
    if (
      mediaType === "tv" &&
      selectedSeason !== null &&
      selectedEpisode !== null
    ) {
      return `${baseUrl}/${mediaType}/${imdbID}${seperator}${selectedSeason}${seperator}${selectedEpisode}`;
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
        </div>
      );
    }
    switch (selectedServer) {
      case 1:
        if (movie?.videoSource) {
        }
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
          ></VideoPlayer>
        );
      case 3:
        return (
          <VideoPlayer
            sourceUrl={`https://multiembed.mov/?video_id=${imdbID} ${imdbID.toString()?.startsWith("t") ? "" : "&tmdb=1"} ${mediaType == "tv" ? `&s=${selectedSeason}&e=${selectedEpisode}` : ""}`}
          ></VideoPlayer>
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
      <section>
        <div className="container">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {loading ? (
              <Skeleton active />
            ) : (
              <>
                <div className="col-span-2 rounded-lg">
                  <div className="relative pb-[10.25%] ">
                    {error && <div className="text-red-500">{error}</div>}
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
                    <div className="mb-5 mt-10 flex items-center gap-2">
                      <div className="h-6 w-1.5 bg-primary"></div>
                      <h3 className="text-2xl font-semibold">Casts</h3>
                    </div>

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
                </div>
                <div className="space-y-8">
                  <div className=" rounded-lg p-2 dark:text-white">
                    {mediaType == "movie" && (
                      <SimilarMovie id={imdbID} mediaType={mediaType} />
                    )}
                    {mediaType == "tv" && (
                      <SeasonChooser
                        seasons={movie?.seasons}
                        onSeasonChange={setSelectedSeason}
                        onEpisodeChange={setSelectedEpisode}
                      />
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Watch;
