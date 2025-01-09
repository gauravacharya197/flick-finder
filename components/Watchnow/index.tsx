"use client";
import { getDetails } from "@/services/MovieService";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { PlayCircleOutlined } from "@ant-design/icons";
import VidPlayer from "@/components/Movie/VidPlayer";
import { Tag } from "antd";
import { SimilarMovie } from "@/components/Movie/SimilarMovie";
import { FaStar } from "react-icons/fa";

const WatchNow = () => {
  const params = useParams();
  const { imdbID } = params; // Access the dynamic parameter
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedServer, setSelectedServer] = useState(1);
  const [movie, setMovie] = useState<any>(null);

  // Dummy movie data

 

  useEffect(() => {
    if (imdbID) {
      getDetails(imdbID.toString())
        .then((response) => {
          console.log(response);

          setMovie(response?.data);
        })
        .catch((error) => {
          console.error("Error fetching movie details:", error);
        });
    }
  }, [imdbID]);
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
            onClick={() => setIsPlaying(true)}
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
            sourceUrl={`https://moviesapi.club/movie/${imdbID}`}
          ></VidPlayer>
        );

      case 2:
        return (
          <VidPlayer
            sourceUrl={`https://vidlink.pro/movie/${imdbID}`}
          ></VidPlayer>
        );
      case 3:
        return (
          <VidPlayer
            sourceUrl={`https://multiembed.mov/?video_id=${imdbID}`}
          ></VidPlayer>
        );
      case 4:
        return <VidPlayer sourceUrl={`https://v2.vidsrc.me/embed/${imdbID}`} />;

      default:
        break;
    }
  };

  return (
        <>
          {/* VidSrc embed iframe */}
          <div
            className="w-full max-w-4xl lg:w-3/4"
            style={{ aspectRatio: "16/9" }}
          >
            {renderMovieScreen()}

            <div className="mt-4 flex gap-4">
              {[1, 2, 3, 4].map((server) => (
                <button
                  key={server}
                  onClick={() => setSelectedServer(server)}
                  className={`rounded px-4 py-2 ${
                    selectedServer === server ? "bg-blue-700" : "bg-blue-500"
                  } text-white`}
                >
                  Server {server}
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              If the current server doesn't work, change the server.
            </p>

            <br />
            {movie==null ? <div>Loading...</div> : 
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
                    <h1 className="mb-1 text-3xl font-bold">{movie?.title}</h1>
                    <div className="mb-2 flex gap-4">
                      <div>
                        <Tag bordered={false} color="purple">
                          Movie
                        </Tag>
                      </div>
                      <div> {movie?.runtime}</div> <div> {movie?.released}</div>
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
<div className="mb-2 text-lg flex">
  <strong className="w-24">Cast</strong>
  <span>: {movie?.actors}</span>
</div>
<div className="mb-2 text-lg flex">
  <strong className="w-24">Director</strong>
  <span>: {movie?.director}</span>
</div>
<div className="mb-2 text-lg flex">
  <strong className="w-24">Awards</strong>
  <span>: {movie?.awards}</span>
</div>
<div className="mb-2 text-lg flex">
  <strong className="w-24">Runtime</strong>
  <span>: {movie?.runtime}</span>
</div>
<div className="mb-2 text-lg flex">
  <strong className="w-24">Rating</strong>
  <span className="flex items-center">
   :&nbsp; <FaStar /> {movie?.imdbRating}
  </span>
</div>
<div className="mt-4"></div>
                  </div>
                </div>
              </div>
            </div>}
          </div>

          {/* Sidebar for related movies */}
          <SimilarMovie id={imdbID}/>
        </>
  );
};

export default WatchNow;
