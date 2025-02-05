"use client";

import MovieCarousel from "@/components/Common/MovieCarousel";
import Home from "@/components/Home";
import FeaturedMovie from "@/components/Movie/FeaturedMovie";
import GenreGrid from "@/components/SearchFilter/GenreGrid";
import { siteConfig } from "@/config/siteConfig";
import useMetadata from "@/hooks/useMetaData";
import { RootState } from "@/redux/store";
import { discover, getTrending } from "@/services/MovieService";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Skeleton } from "antd";
import { FaFire, FaHeart, FaTv } from "react-icons/fa";
import { MdPeople } from "react-icons/md";
import { useSelector } from "react-redux";
const MovieHomepage = () => {
  useMetadata(siteConfig.siteName, "");

  const { genres: genreFilters } = useSelector(
    (state: RootState) => state.filters,
  );
  const lastYear = new Date().getFullYear() - 1;

  const { error, isError, data:trendingMovies, isLoading:trendingMoviesLoading } = useInfiniteQuery({
    queryKey: ["trending", "All"],
    queryFn: async ({ pageParam = 1 }) => {const response = await getTrending("All", "day", pageParam.toString());
      return response;
    },
    getNextPageParam: () => null,
    initialPageParam: 1,
    staleTime: 1000 * 60 * 60 * 24, // Cache the data for 1day 
  });

  const {
    data: popularMovies, isLoading: popularMoviesLoading, } = useQuery({
    queryKey: ["popular-lastYear"],
    queryFn: async () => {
      const response = await discover({pageNumber: 1,mediaType: "All", sortBy: "vote_count.desc", year: lastYear });
      return response;
    },
    staleTime: 1 * 1000 * 60 * 60 * 24,
    retry: 1,
  });

  const movies = trendingMovies?.pages.flatMap((page) => page.data.results) || [];
  const featuredMovie = movies[0];

  // Split remaining movies into two groups of 10 for carousels
  const remainingMovies = movies.slice(1);
  const firstCarouselMovies = remainingMovies.filter(
    (x) => x.mediaType == "movie",
  );
  const secondCarouselMovies = remainingMovies.filter(
    (x) => x.mediaType == "tv",
  );



  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center  text-white">
         <div className="container mx-auto px-4  lg:px-8 ">
        <p>Error loading movies. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-white">
      {/* Hero Section */}
      
      {trendingMoviesLoading ? (
        <div className="container mx-auto px-4 py-8 lg:px-8 ">
          <Skeleton active className="h-full w-full" />
        </div>
      ) : (
        <FeaturedMovie movie={featuredMovie} />
      )}

      {/* Trending Section with Carousel */}
      {trendingMoviesLoading ? (
        <div className="container mx-auto px-4 py-8 lg:px-8 ">
          <Skeleton active className="mb-4 h-8 w-48" />
          <div className="flex gap-4">
            {[...Array(5)].map((_, index) => (
              <Skeleton
                active
                key={index}
                className="h-[300px] w-[200px] rounded-lg"
              />
            ))}
          </div>
        </div>
      ) : (
        <MovieCarousel
          key={0}
          movies={firstCarouselMovies}
          title={`Trending Now `}
          icon={FaFire}
        />
      )}

      {/* New Releases Carousel */}
      {trendingMoviesLoading ? (
        <div className="container mx-auto px-4 py-8 lg:px-8 ">
          <Skeleton active className="mb-4 h-8 w-48" />
          <div className="flex gap-4">
            {[...Array(5)].map((_, index) => (
              <Skeleton
                active
                key={index}
                className="h-[300px] w-[200px] rounded-lg"
              />
            ))}
          </div>
        </div>
      ) : (
        <MovieCarousel
          key={1}
          movies={secondCarouselMovies}
          title="Popular shows"
          icon={FaTv}
        />
      )}
      {/* New Releases Carousel */}
      {popularMoviesLoading ? (
        <div className="container mx-auto px-4 py-8 lg:px-8 ">
          <Skeleton active className="mb-4 h-8 w-48" />
          <div className="flex gap-4">
            {[...Array(5)].map((_, index) => (
              <Skeleton
                active
                key={index}
                className="h-[300px] w-[200px] rounded-lg"
              />
            ))}
          </div>
        </div>
      ) : (
        <MovieCarousel
          key={2}
          movies={popularMovies?.data.results || []}
          title={`Best of ${lastYear}`}
          icon={FaHeart}
        />
      )}
      <div className="container mx-auto px-4 py-8 lg:px-8 ">
        <GenreGrid genres={genreFilters} />
      </div>
    </div>
  );
};

export default MovieHomepage;
