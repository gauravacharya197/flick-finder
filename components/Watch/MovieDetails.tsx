import { Tag } from 'antd';
import React from 'react';
import { CustomTag } from '../Common/CustomTag';
import { getSourceIcon } from '@/utils/getSourceIcon';
const MovieDetails = ({ movie, mediaType }) => {
 
  
  return (
    <div className="flex flex-col gap-7.5 lg:flex-row xl:gap-12.5">
      {/* Grid container that becomes single column on mobile */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
         {/* Image column - smaller on mobile, original size on desktop */}
         <div className="mx-auto w-full lg:col-span-3 lg:mx-0">
          <div className="relative mx-auto h-64 w-48 sm:h-72 sm:w-52 md:h-80 md:w-56 lg:h-auto lg:w-[95%]">
            <img
              className="h-full w-full rounded-2xl object-cover"
              src={movie?.poster || "/images/user/failedtoload.jpg"}
              alt={movie?.title}
            />
          </div>
        </div>

        {/* Content column - full width on mobile, 9 columns on desktop */}
        <div className="lg:col-span-9">
          <div className="flex-grow">
            <h1 className="mb-1 text-3xl font-bold">
              {movie?.title}
            </h1>
            
            <div className="mb-2 flex flex-wrap gap-4">
              <div>
                <CustomTag text={movie?.mediaType} />
              </div>
              <div>{movie?.runtime}</div>
              <div>{movie?.released}</div>
              <div>
                <Tag color="default">{movie?.rated}</Tag>
              </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {movie?.genres.map((x, index) => (
                <Tag
                  key={index}
                  className="mb-2 px-4 py-1 text-sm"
                  bordered={false}
                >
                  {x.name}
                </Tag>
              ))}
            </div>

            <div className="mb-2 text-lg">
              <p>{movie?.plot}</p>
            </div>

            {/* Movie details section */}
           {/* Movie details table */}
           <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <tbody>
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
                  
                  <tr className="border-b">
                    <td className="py-3 pr-4 font-bold">Ratings</td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-4">
                        {movie?.ratings?.length > 0 ? (
                          movie.ratings.map((rating, index) => (
                            <div key={index} className="flex items-center">
                              {getSourceIcon(rating.source)}
                              <span className="ml-2">{rating.value}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </div>
                    </td>
                  </tr>
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
    <tr className="border-b">
      <td className="w-32 py-3 pr-4 font-bold">{label}</td>
      <td className="py-3">{value}</td>
    </tr>
  );

export default MovieDetails;