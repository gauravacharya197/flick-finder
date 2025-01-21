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
  const { data: movie, loading, error } = useFetch(
    () => getDetails(imdbID.toString(), mediaType.toString()).then((res) => res.data),
    [imdbID, mediaType]
  );
  useMetadata(` ${movie?.title? `Watch ${movie?.title} Full ${mediaType.toString().toUpperCase()} Online`: '' }`, '');


  

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
            src={movie?.coverImage || movie?.poster || '/images/user/failedtoload.jpg'}
           
          />
          <PlayCircleOutlined
            onClick={() => { setIsPlaying(true)}}
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
        if(movie?.videoSource){

        }
        return (
          
          
          <VideoPlayer
          sourceUrl={
            movie?.videoSource
              ? movie.videoSource.startsWith("https://short.ink")
                ? movie.videoSource
                : baseUrl + "?source=" + movie.videoSource
              : constructUrl("https://moviesapi.club", mediaType, imdbID, selectedSeason, selectedEpisode)
          }
        />
        );

      case 2:
        return (
          <VideoPlayer
          sourceUrl={constructUrl("https://vidlink.pro", mediaType, imdbID, selectedSeason, selectedEpisode,"/")}
          ></VideoPlayer>
        );
      case 3:
        return (
          <VideoPlayer
            sourceUrl={`https://multiembed.mov/?video_id=${imdbID} ${imdbID.toString()?.startsWith('t') ? '' : '&tmdb=1'} ${mediaType=="tv"? `&s=${selectedSeason}&e=${selectedEpisode}` : '' }`}
          ></VideoPlayer>
        );
      case 4:
        return <VideoPlayer 
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
                ) : (
                  <>
                  { error &&  <div className="text-red-500">{error}</div> }
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
                            src={movie?.poster || '/images/user/failedtoload.jpg'}
                           
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
                         
                          {movie?.genres.map((x, index) => (
                            <Tag
                              key={index}
                              className={` mb-2 px-4 py-1 text-sm md:text-sm`}
                              bordered={false}
                            >
                              {x.name}
                            </Tag>
                          ))}
                          <br />
                          <div className="mb-2 text-lg">
                            <p>{movie?.plot}</p>
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
                          {mediaType=="movie" && <> <div className="mb-2 flex text-lg">
                            <strong className="w-24">Budget</strong>
                            <span>: {movie?.budget}</span>
                          </div>
                          <div className="mb-2 flex text-lg">
                            <strong className="w-24">Box Office</strong>
                            <span>: {movie?.boxOffice}</span>
                          </div>
                          </>}
                          <div className="mb-2 flex items-center text-lg">
  <strong className="w-24">Ratings</strong>
  <span>: </span>
  <div className="flex flex-wrap items-center gap-4 ml-2">
    {movie?.ratings?.length > 0 ? (
      movie.ratings.map((rating, index) => (
        <div key={index} className="flex items-center">
          {/* Display icon based on source */}
          {getSourceIcon(rating.source)}
          <span className="ml-2">
            {rating.value}
          </span>
        </div>
      ))
    ) : (
      <span className="text-gray-500">N/A</span>
    )}
  </div>
</div>
                        </div>
                        
                      </div>
                     
                    </div>
                  
                  </div>
                  <h3 className="text-2xl font-semibold pb-3">Casts</h3>

                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-5">
                    
      {movie?.casts.map((character, index) => (
        <CastCard
          key={index}
          imgSrc={character.profilePath}
          name={character.name}
          role={character.character}
        />
      ))}
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

export default Watch;
