"use client";
import { Skeleton } from "antd";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

const WatchNowPage = () => {
  const params = useParams();
  const { imdbID } = params; // Access the dynamic parameter
  const [isLoading, setIsLoading] = useState(true);

  // Dummy movie data
  const movie = {
    title: "Dummy Movie Title",
    plot: "This is a dummy plot for the movie.",
    actors: "Actor 1, Actor 2, Actor 3",
    director: "Director Name",
    awards: "Best Movie Award",
    poster: "https://via.placeholder.com/300x450", // Placeholder image
    runtime: "120 min",
    rating: "8.5/10",
  };

  // Dummy related movies data
  const relatedMovies = [
    {
      title: "Related Movie 1",
      poster:
        "https://m.media-amazon.com/images/M/MV5BMTkxYjU1OTMtYWViZC00ZjAzLWI3MDktZGQ2N2VmMjVjNDRlXkEyXkFqcGc@._V1_SX300.jpg",
      runtime: "90 min",
      rating: "7.8/10",
    },
    {
      title: "Related Movie 2",
      poster:
        "https://m.media-amazon.com/images/M/MV5BMTkxYjU1OTMtYWViZC00ZjAzLWI3MDktZGQ2N2VmMjVjNDRlXkEyXkFqcGc@._V1_SX300.jpg",
      runtime: "110 min",
      rating: "8.2/10",
    },
    {
      title: "Related Movie 3",
      poster:
        "https://m.media-amazon.com/images/M/MV5BMTkxYjU1OTMtYWViZC00ZjAzLWI3MDktZGQ2N2VmMjVjNDRlXkEyXkFqcGc@._V1_SX300.jpg",
      runtime: "95 min",
      rating: "7.5/10",
    },
  ];

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="pb-20 pt-35 lg:pb-25 lg:pt-40 xl:pb-30 xl:pt-25 dark:bg-gray-900 dark:text-white">
      <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
        <div className="mt-8 flex flex-col gap-7.5 lg:flex-row xl:gap-12.5">
          {/* VidSrc embed iframe */}
          <div
            className="w-full max-w-4xl lg:w-3/4"
            style={{ aspectRatio: "16/9" }}
          >
            <iframe
              onLoad={() => setIsLoading(false)}
              src={`https://v2.vidsrc.me/embed/${imdbID}/`}
              allowFullScreen
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              className="h-full w-full rounded-md shadow-lg"
              frameBorder="0"
              style={{ height: "600px" }} // Increase the height here
            ></iframe>
            <br/>
            <div className="flex flex-col gap-7.5 lg:flex-row xl:gap-12.5">
              
              <div className="flex-grow">
                <h1 className="mb-4 text-3xl font-bold">{movie.title}</h1>
                <p className="mb-2 text-lg">
                  <strong>Plot:</strong> {movie.plot}
                </p>
                <p className="mb-2 text-lg">
                  <strong>Cast:</strong> {movie.actors}
                </p>
                <p className="mb-2 text-lg">
                  <strong>Director:</strong> {movie.director}
                </p>
                <p className="mb-2 text-lg">
                  <strong>Awards:</strong> {movie.awards}
                </p>
                <p className="mb-2 text-lg">
                  <strong>Runtime:</strong> {movie.runtime}
                </p>
                <p className="mb-2 text-lg">
                  <strong>Rating:</strong> {movie.rating}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar for related movies */}
          <div className="w-full lg:w-1/4">
            <h2 className="mb-4 text-2xl font-bold">Related Movies</h2>
            <div className="flex flex-col gap-4">
              {relatedMovies.map((relatedMovie, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-md bg-white dark:bg-gray-800 p-4 shadow-lg"
                >
                  <img
                    src={relatedMovie.poster}
                    alt={relatedMovie.title}
                    className="h-24 w-16 rounded-md"
                  />
                  <div>
                    <h3 className="text-lg font-bold">{relatedMovie.title}</h3>
                    <p className="text-sm">
                      <strong>Runtime:</strong> {relatedMovie.runtime}
                    </p>
                    <p className="text-sm">
                      <strong>Rating:</strong> {relatedMovie.rating}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WatchNowPage;
