"use client";
import { getDetails } from "@/services/MovieService";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { PlayCircleOutlined } from "@ant-design/icons";
import VidPlayer from "@/components/Movie/VidPlayer";
import { Tag } from "antd";
import { SimilarMovie } from "@/components/Movie/SimilarMovie";
const WatchNowPage = () => {
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
            src={movie?.poster}
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
            sourceUrl={`https://vidlink.pro/movie/${imdbID}`}
          ></VidPlayer>
        );

      case 2:
        return (
          <VidPlayer
            sourceUrl={`https://moviesapi.club/movie/${imdbID}`}
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
    <section className="pb-20 pt-35 dark:bg-gray-900 dark:text-white lg:pb-25 lg:pt-40 xl:pb-30 xl:pt-25">
      <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
        <div className="mt-8 flex flex-col gap-3.5 lg:flex-row xl:gap-4.5">
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
                    <p className="mb-2 text-lg">{movie?.plot}</p>
                    <p className="mb-2 text-lg">
                      <strong>Cast:</strong> {movie?.actors}
                    </p>
                    <p className="mb-2 text-lg">
                      <strong>Director:</strong> {movie?.director}
                    </p>
                    <p className="mb-2 text-lg">
                      <strong>Awards:</strong> {movie?.awards}
                    </p>
                    <p className="mb-2 text-lg">
                      <strong>Runtime:</strong> {movie?.runtime}
                    </p>
                    <p className="mb-2 text-lg">
                      <strong>Rating:</strong> {movie?.imdbRating} of{" "}
                      {movie?.imdbVotes} votes
                    </p>
                    <div className="mt-4"></div>
                  </div>
                </div>
              </div>
            </div>}
          </div>

          {/* Sidebar for related movies */}
          <SimilarMovie id={imdbID}/>
        </div>
      </div>
    </section>
  );
};

export default WatchNowPage;
