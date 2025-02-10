import React from "react";
import { CustomTag } from "../Common/CustomTag";
import { getSourceIcon } from "@/utils/getSourceIcon";
import { formatDate } from "@/utils/formatDate";

const MovieDetails = ({ movie, mediaType }) => {
  return (
    <div className="flex flex-col gap-7.5 lg:flex-row xl:gap-12.5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Image column - keeping original alignment */}
        <div className="mx-auto w-full lg:col-span-3 lg:mx-0">
          <div className="relative mx-auto h-64 w-48 sm:h-72 sm:w-52 md:h-80 md:w-56 lg:h-auto lg:w-[95%]">
            <img
              className="h-full w-full rounded-2xl object-cover shadow-lg ring-1 ring-gray-800/20"
              src={movie?.posterPath || "/images/user/failedtoload.jpg"}
              alt={movie?.title}
            />
          </div>
        </div>

        {/* Content column */}
        <div className="lg:col-span-9">
          <div className="flex-grow space-y-6">
            {/* Title and Meta Section */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight">{movie?.title}</h1>

              <div className="flex flex-wrap gap-4 items-center">
                <CustomTag text={movie?.mediaType} />
                <span className="text-gray-300">{movie?.runtime}</span>
                <span className="text-gray-300">{formatDate(movie?.released)}</span>
                {movie?.rated && (
                <CustomTag color="bg-white/10 text-white" text={movie?.rated} />
              )}
              </div>

              <div className="flex flex-wrap gap-2">
                {movie?.genres?.map((x, index) => (
                  <CustomTag
                    key={index}
                    text={x.name}
                    color="bg-gray-800"
                    small={false}
                  />
                ))}
              </div>
            </div>

            {/* Plot */}
            <div className="text-lg text-gray-300">
              <p>{movie?.plot}</p>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto rounded-lg bg-gray-900/50 backdrop-blur-sm">
              <table className="w-full">
                <tbody className="divide-y divide-gray-800">
                  <TableRow label="Director" value={movie?.director} />
                  <TableRow label="Awards" value={movie?.awards} />
                  <TableRow label="Runtime" value={movie?.runtime} />
                  <TableRow label="Country" value={movie?.country} />
                  <TableRow label="Language" value={movie?.language} />

                  {mediaType === "movie" && (
                    <>
                      <TableRow label="Budget" value={movie?.budget} />
                      <TableRow label="Box Office" value={movie?.boxOffice} />
                    </>
                  )}
                  <TableRow
                    label="Ratings"
                    value={
                      <div className="flex flex-wrap gap-4">
                        {movie?.ratings?.length > 0 ? (
                          movie.ratings.map((rating, index) => (
                            <div key={index} className="flex items-center">
                              <span className="text-gray-400">
                                {getSourceIcon(rating.source)}
                              </span>
                              <span className="ml-2">{rating.value}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </div>
                    }
                  />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TableRow = ({ label, value }) => (
  <tr>
    <td className="w-32 py-3 pl-4 pr-4 font-medium text-gray-300">{label}</td>
    <td className="py-3 pr-4">{value || <span className="text-gray-500">N/A</span>}</td>
  </tr>
);

export default MovieDetails;