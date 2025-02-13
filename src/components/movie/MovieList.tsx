import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { FaStar } from "react-icons/fa";
import { truncateString } from "@/utils/truncateString";
import { CustomTag } from "../common/CustomTag";
import { Rating } from "../common/Rating";
import { formatDate } from "@/utils/formatDate";
import { constructWatchUrl } from "@/utils/constructWatchUrl";
import MovieCard from "./MovieCard";

interface MovieListProps {
  movies: any[];
  showFeaturedMovie?: boolean; // Optional prop
}

export const MovieList = ({
  movies,
  showFeaturedMovie = false,
}: MovieListProps) => {
  const { genres: genresData } = useSelector((state: any) => state.filters);

  const featuredMovie = movies?.[0];
  const featuredMovieTitle = featuredMovie?.displayTitle;
  const featuredMovieRelease = featuredMovie?.displayReleaseDate;

  // If showFeaturedMovie is false, start the list from the second movie
  const movieList = showFeaturedMovie ? movies?.slice(1) : movies;

  return (
    <>
      {showFeaturedMovie && featuredMovie && (
        <div className="relative mb-8 aspect-[15/9] w-full md:aspect-[25/9]">
          <Link href={constructWatchUrl(featuredMovie?.mediaType, featuredMovie?.id,featuredMovie?.displayTitle)}>
            <img
              src={`http://image.tmdb.org/t/p/original/${featuredMovie?.backdropPath}`}
              alt={featuredMovieTitle}
              className="absolute h-full w-full rounded-md object-cover"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src =
                  "https://icon-library.com/images/no-picture-available-icon/no-picture-available-icon-1.jpg";
                e.currentTarget.onerror = null;
              }}
            />

            <div className="absolute inset-0 flex flex-col justify-end rounded-md bg-gradient-to-t from-black/90 to-black/20 p-4">
              <h1 className="text-2xl font-bold text-white md:text-4xl">
                {featuredMovieTitle}
              </h1>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded bg-primary px-2 py-1 text-white">
                  <CustomTag key={"type"} text={featuredMovie?.mediaType} />
                </span>
                {featuredMovie?.genreIds
                  ?.map((x: string) => {
                    const genre = genresData.find(
                      (y: any) => y.externalId === x,
                    );
                    return genre ? genre.name : "";
                  })
                  .filter((name:any) => name)
                  .map((genreName:any, index:any) => (
                    <CustomTag
                      key={index}
                      text={genreName}
                      color="bg-gray-800"
                      small={false}
                    />
                  ))}
                <CustomTag
                  key={"date"}
                  text={formatDate(featuredMovieRelease)}
                  color="bg-gray-800"
                  small={false}
                />

                <Rating voteAverage={featuredMovie?.voteAverage} />
              </div>
            </div>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {movieList?.map((movie,index) => <MovieCard key={index} movie={movie} />)}
      </div>
    </>
  );
};
