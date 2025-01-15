"use client";
import { getDetails } from "@/services/MovieService";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { PlayCircleOutlined } from "@ant-design/icons";
import VidPlayer from "@/components/Movie/VidPlayer";
import { Skeleton, Spin, Tag } from "antd";
import { SimilarMovie } from "@/components/Movie/SimilarMovie";
import { FaStar } from "react-icons/fa";
import { CustomTag } from "../Common/CustomTag";
import SeasonChooser from "./SeasonChooser";
import toast from "react-hot-toast";
import useFetch from "@/hooks/useFetch";
const WatchNow = () => {
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
  const { data: movie, loading, error } = useFetch(
    () => getDetails(imdbID.toString(), mediaType.toString()).then((res) => res.data),
    [imdbID, mediaType]
  );

  

  const constructUrl = (baseUrl: string, mediaType: any, imdbID: any, selectedSeason: number | null, selectedEpisode: number | null,seperator='-') => {
    if (mediaType === "tv" && selectedSeason !== null && selectedEpisode !== null) {
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
            src={movie?.coverImage || movie?.poster}
            
          />
          <PlayCircleOutlined
            onClick={() => {movie!==null? setIsPlaying(true) : null}}
            className="absolute inset-0 m-auto text-6xl text-white"
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
        return (
          <VidPlayer
          sourceUrl={constructUrl("https://moviesapi.club", mediaType, imdbID, selectedSeason, selectedEpisode)}
          ></VidPlayer>
        );

      case 2:
        return (
          <VidPlayer
          sourceUrl={constructUrl("https://vidlink.pro", mediaType, imdbID, selectedSeason, selectedEpisode,"/")}
          ></VidPlayer>
        );
      case 3:
        return (
          <VidPlayer
            sourceUrl={`https://multiembed.mov/?video_id=${imdbID} ${imdbID.toString()?.startsWith('t') ? '' : '&tmdb=1'} ${mediaType=="tv"? `&s=${selectedSeason}&e=${selectedEpisode}` : '' }`}
          ></VidPlayer>
        );
      case 4:
        return <VidPlayer 
        sourceUrl={constructUrl("https://v2.vidsrc.me/embed/", mediaType, imdbID, selectedSeason, selectedEpisode,"/")}
        />;

      default:
        break;
    }
  };

  return (
    <>
    
      <section>
        <div className="container">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="col-span-2 rounded-lg">
              <div className="relative pb-[10.25%] ">
                {loading ? (
               
                <p>Loading</p>
                ) : error ? (
                  <div className="text-red-500">{error}</div>
                ) : (
                  <>
                  {renderMovieScreen()}
                

                <div className="mt-4 flex gap-4">
                  {[1, 2, 3, 4].map((server) => (
                    <button
                      key={server}
                      onClick={() => setSelectedServer(server)}
                      className={`rounded px-4 py-2 ${
                        selectedServer === server
                          ? "bg-blue-700"
                          : "bg-blue-500"
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
                
                  <div className="flex flex-col gap-7.5 lg:flex-row xl:gap-12.5">
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-3">
                        <div
                          className="relative"
                          style={{ width: "95%", height: "60vh" }}
                        >
                          <img
                            style={{
                              width: "100%",
                              height: "50%",
                              borderRadius: "15px",
                            }}
                            src={movie?.poster}
                          />
                        </div>
                      </div>

                      <div className="col-span-9">
                        <div className="flex-grow">
                          <h1 className="mb-1 text-3xl font-bold">
                            {movie?.title}
                          </h1>
                          <div className="mb-2 flex gap-4">
                            <div>
                              <CustomTag text={movie?.mediaType} />
                            </div>
                            <div> {movie?.runtime}</div>{" "}
                            <div> {movie?.released}</div>
                            <div>
                              <Tag color="default">{movie?.rated}</Tag>
                            </div>
                          </div>
                          {movie?.genre?.split(",").map((x, index) => (
                            <Tag
                              key={index}
                              className={` mb-2 px-4 py-1 text-sm md:text-sm`}
                              bordered={false}
                            >
                              {x}
                            </Tag>
                          ))}
                          <br />
                          <div className="mb-2 text-lg">
                            <p>{movie?.plot}</p>
                          </div>
                          <div className="mb-2 flex text-lg">
                            <strong className="w-24">Cast</strong>
                            <span>: {movie?.actors}</span>
                          </div>
                          <div className="mb-2 flex text-lg">
                            <strong className="w-24">Director</strong>
                            <span>: {movie?.director}</span>
                          </div>
                          <div className="mb-2 flex text-lg">
                            <strong className="w-24">Awards</strong>
                            <span>: {movie?.awards}</span>
                          </div>
                          <div className="mb-2 flex text-lg">
                            <strong className="w-24">Runtime</strong>
                            <span>: {movie?.runtime}</span>
                          </div>
                          <div className="mb-2 flex text-lg">
                            <strong className="w-24">Country</strong>
                            <span>: {movie?.country}</span>
                          </div>
                          <div className="mb-2 flex text-lg">
                            <strong className="w-24">Language</strong>
                            <span>: {movie?.language}</span>
                          </div>
                          <div className="mb-2 flex text-lg">
                            <strong className="w-24">Box Office</strong>
                            <span>: {movie?.boxOffice}</span>
                          </div>
                          <div className="mb-2 flex text-lg">
                            <strong className="w-24">Rating</strong>
                            <span className="flex items-center">
                              :&nbsp; <FaStar className="pr-1" />{" "}
                              {Number(movie?.imdbRating).toFixed(1) || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                
              </>)}
              </div>
            </div>
            <div className="space-y-8">
              <div className=" rounded-lg p-4 dark:text-white">
              {mediaType == "movie" && (
        <SimilarMovie id={imdbID} mediaType={mediaType} />
      )}
      {mediaType == "tv" &&  <SeasonChooser
                    seasons={movie?.seasons}
                    onSeasonChange={setSelectedSeason}
                    onEpisodeChange={setSelectedEpisode}
                  />}
              </div>
            </div>
          </div>
        </div>
      </section>    
    </>
  );
};

export default WatchNow;
