'use client'
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FaCalendar, FaMap, FaStar, FaImdb } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getCastWithCredits } from "@/services/MovieService";
import { MovieList } from "../movie/MovieList";
import Skeleton from "../common/Skeleton";
import useMetadata from "@/hooks/useMetaData";
import { siteConfig } from "@/config/siteConfig";

interface CastProps {
  castId: string;
}

export const Cast: React.FC<CastProps> = ({ castId }) => {
  const { data: castInfo, isLoading, error } = useQuery({
    queryKey: ['cast', castId],
    queryFn: () => getCastWithCredits(castId)
  });

  const metadata = {
    title: castInfo?.data ? 
      `${castInfo.data.name} - Actor Profile and Filmography | ${siteConfig.siteName}` : 
      `Cast Profile | ${siteConfig.siteName}`,
    description: castInfo?.data ? 
      `Explore ${castInfo.data.name}'s complete filmography, biography, and career highlights. Known for ${
        castInfo.data.combinedCredits?.cast
          ?.slice(0, 2)
          .map(credit => credit.displayTitle)
          .join(', ')
      }. ${castInfo.data.knownForDepartment} since ${new Date(castInfo.data.birthday).getFullYear()}.`.slice(0, 160) :
      'Discover detailed actor profiles, complete filmographies, and career information.',
    openGraph: {
      title: castInfo?.data?.name,
      description: castInfo?.data?.biography?.slice(0, 160),
      images: castInfo?.data?.profilePath ? 
        [`https://image.tmdb.org/t/p/w500${castInfo.data.profilePath}`] : 
        [],
    }
  };

  useMetadata(metadata.title,metadata.description,metadata.openGraph);

  if (isLoading) {
    return (
      <>
      {[1, 2, 3].map((i) => (
                    <Skeleton 
                      key={i}
                      showTitle={false}
                      rows={5}
                      rowHeight="h-9"
                      className="w-full"
                    />
                  ))}
      </>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-2xl font-light tracking-wider text-red-400">
          Error loading cast details
        </div>
      </div>
    );
  }

 
  return (
    <div className=" bg-gradient-to-br">
      <div className="">
        <div className="">
          {/* Header Section */}
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Profile Image */}
              <div className="md:col-span-1">
                <div className="relative group rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${castInfo?.data?.profilePath}`}
                    alt={castInfo?.data?.name}
                    className="w-full h-[28rem] object-cover object-center transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-70" />
                  
                  {/* IMDb Link */}
                  {castInfo?.data?.imdbId && (
                    <a
                      href={`https://www.imdb.com/name/${castInfo.data.imdbId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-4 left-4 flex items-center gap-2 bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full backdrop-blur-sm transition-all duration-300 hover:bg-yellow-500/30"
                    >
                      <FaImdb className="w-5 h-5" />
                      <span className="text-sm font-medium">IMDb Profile</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Basic Info */}
              <div className="md:col-span-2 flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {castInfo?.data?.name}
                  </h1>
                  
                  <div className="flex flex-wrap gap-3">
                    {castInfo?.data?.birthday && (
                      <span className="flex items-center rounded-full bg-blue-500/10 px-4 py-2 text-sm text-blue-300 border border-blue-500/20 backdrop-blur-sm transition-all duration-300 hover:bg-blue-500/20">
                        <FaCalendar className="w-4 h-4 mr-2" />
                        {new Date(castInfo.data.birthday).toLocaleDateString()}
                      </span>
                    )}
                    {castInfo?.data?.placeOfBirth && (
                      <span className="flex items-center rounded-full bg-purple-500/10 px-4 py-2 text-sm text-purple-300 border border-purple-500/20 backdrop-blur-sm transition-all duration-300 hover:bg-purple-500/20">
                        <FaMap className="w-4 h-4 mr-2" />
                        {castInfo.data.placeOfBirth}
                      </span>
                    )}
                    {castInfo?.data?.knownForDepartment && (
                      <span className="flex items-center rounded-full bg-pink-500/10 px-4 py-2 text-sm text-pink-300 border border-pink-500/20 backdrop-blur-sm transition-all duration-300 hover:bg-pink-500/20">
                        <FaStar className="w-4 h-4 mr-2" />
                        {castInfo.data.knownForDepartment}
                      </span>
                    )}
                  </div>
                </div>

                {/* Biography */}
                {castInfo?.data?.biography && (
                  <Card className="bg-gray-800/30 border-0 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <p className="text-gray-300 leading-relaxed">
                        {castInfo.data.biography}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>

          {/* Filmography Section */}
          {castInfo?.data?.combinedCredits?.cast?.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold text-blue-300">Filmography</h2>
              <div className=" rounded-2xl backdrop-blur-sm ">
                <MovieList movies={castInfo?.data.combinedCredits.cast} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cast;