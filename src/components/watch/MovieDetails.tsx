import React from "react";
import { CustomTag } from "../common/CustomTag";
import { getSourceIcon } from "@/utils/getSourceIcon";
import { formatDate } from "@/utils/formatDate";

const MovieDetails = ({ movie, mediaType }) => {
  const generateKeywords = () => {
    const title = movie?.title || '';
    const year = new Date(movie?.released).getFullYear();
    const finalMediaType = mediaType === "movie" ? "Movie" : "Series";
    return [
      `Watch ${title} Online`,
      `${title} ${year} Full ${finalMediaType}`,
      `${title} Free Streaming`,
      `${title} ${finalMediaType} Watch Free HD`,
      `${title} ${finalMediaType} Download`,
    ];
  };

  return (
    <div className="bg-gray-900/40 backdrop-blur-md rounded-xl  text-white">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Poster Section */}
        <div className="lg:w-1/4">
          <div className="relative group">
            <img
              className="w-full rounded-lg shadow-xl transition-transform duration-300 group-hover:scale-105"
              src={movie?.posterPath || "/images/user/failedtoload.jpg"}
              alt={movie?.title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
          </div>
        </div>

        {/* Content Section */}
        <div className="lg:w-3/4 space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              {movie?.title}
            </h1>
            {movie?.tagLine && (
              <p className="text-lg italic text-gray-400">{movie.tagLine}</p>
            )}
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3">
              <CustomTag text={movie?.mediaType} />
              <span className="text-gray-400">•</span>
              <span className="text-gray-300">{movie?.runtime}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-300">{formatDate(movie?.released)}</span>
              {movie?.rated && (
                <CustomTag color="bg-white/10 text-white" text={movie?.rated} />
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {movie?.genres?.map((x, index) => (
                <CustomTag
                  key={index}
                  text={x.name}
                  color="bg-gray-800/80 hover:bg-gray-700/80 transition-colors"
                  small={false}
                />
              ))}
            </div>
          </div>

          {/* Plot */}
          <p className="text-lg text-gray-300 leading-relaxed">{movie?.plot}</p>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-800/30 rounded-lg p-4">
            <DetailItem label="Director" value={movie?.director} />
            <DetailItem label="Awards" value={movie?.awards} />
            <DetailItem label="Country" value={movie?.country} />
            <DetailItem label="Language" value={movie?.language} />
            {mediaType === "movie" && (
              <>
                <DetailItem label="Budget" value={movie?.budget} />
                <DetailItem label="Box Office" value={movie?.boxOffice} />
              </>
            )}
          </div>

          {/* Ratings */}
          <div className="bg-gray-800/30 rounded-lg p-4">
            <h3 className="text-lg font-medium mb-3">Ratings</h3>
            <div className="flex flex-wrap gap-6">
              {movie?.ratings?.length > 0 ? (
                movie.ratings.map((rating, index) => (
                  <div key={index} className="flex items-center bg-gray-700/30 rounded-lg px-4 py-2">
                    <span className="text-gray-300">{getSourceIcon(rating.source)}</span>
                    <span className="ml-2 font-medium">{rating.value}</span>
                  </div>
                ))
              ) : (
                <span className="text-gray-500">No ratings available</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Keywords */}
      <div className="mt-6 space-y-3">
        <h3 className="text-lg font-medium">Keywords</h3>
        <div className="flex flex-wrap gap-3">
          {generateKeywords().map((keyword) => (
            <CustomTag
              key={keyword}
              text={keyword}
              color="bg-gray-800/80 hover:bg-gray-700/80 transition-colors"
              small={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="space-y-1">
    <div className="text-sm text-gray-400">{label}</div>
    <div className="text-gray-200">{value || <span className="text-gray-500">N/A</span>}</div>
  </div>
);

export default MovieDetails;