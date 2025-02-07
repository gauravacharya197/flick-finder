"use client";

import MovieCarousel from "@/components/Common/MovieCarousel";
import Home from "@/components/Home";
import FeaturedMovie from "@/components/Movie/FeaturedMovie";
import GenreGrid from "@/components/SearchFilter/GenreGrid";
import { siteConfig } from "@/config/siteConfig";
import useMetadata from "@/hooks/useMetaData";
import { RootState } from "@/redux/store";
import { discover, getMovies, getTrending } from "@/services/MovieService";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Skeleton } from "antd";
import { FaDollarSign, FaFire, FaHeart, FaStar, FaTv } from "react-icons/fa";
import { MdPeople } from "react-icons/md";
import { useSelector } from "react-redux";
const MovieHomepage = () => {
  useMetadata(siteConfig.siteName, "");
  const { genres: genreFilters } = useSelector(
    (state: RootState) => state.filters,
  );
  const lastYear = new Date().getFullYear() - 1;

  // Query for each category
  

  const { error, isError, data:trendingMovies, isLoading:trendingLoading } = useInfiniteQuery({
    queryKey: ["trending", "All"],
    queryFn: async ({ pageParam = 1 }) => {const response = getMovies("Trending");
      return response;
    },
    getNextPageParam: () => null,
    initialPageParam: 1,
    staleTime: 1000 * 60 * 60 * 24, // Cache the data for 1day 
  });

  const { data: topRatedMovies, isLoading: topRatedLoading } = useQuery({
    queryKey: ["movies", "TopRated"],
    queryFn: () => getMovies("TopRated"),
    staleTime: 1000 * 60 * 60 * 24,
  });

  const { data: lastYearMovies, isLoading: lastYearLoading } = useQuery({
    queryKey: ["movies", "LastYearBest"],
    queryFn: () => getMovies("LastYearBest"),
    staleTime: 1000 * 60 * 60 * 24,
  });

  const { data: topGrossingMovies, isLoading: topGrossingLoading } = useQuery({
    queryKey: ["movies", "TopGrossing"],
    queryFn: () => getMovies("TopGrossing"),
    staleTime: 1000 * 60 * 60 * 24,
  });

  // Filter TV shows from trending movies for Popular Shows section
  const trending = trendingMovies?.pages.flatMap((page) => page.data.results) || [];
  const featuredMovie = trending[0];

  // Split remaining movies into two groups of 10 for carousels
  const remainingMovies = trending.slice(1);
  const trendingMovieCarousel = remainingMovies.filter(
    (x) => x.mediaType == "movie",
  );
  const trendingTVCarousel = remainingMovies.filter(
    (x) => x.mediaType == "tv",
  );

  

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <p>Error loading movies. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      {/* Hero Section */}
      {trendingLoading ? (
        <div className="container mx-auto px-4 py-8 lg:px-8">
          <Skeleton active className="h-full w-full" />
        </div>
      ) : (
        <FeaturedMovie movie={featuredMovie} />
      )}

      {/* Trending Movies Section */}
      {trendingLoading ? (
        <SkeletonCarousel />
      ) : (
        <MovieCarousel
          key="trending"
          movies={trendingMovieCarousel || []}
          title="Trending Now"
          icon={FaFire}
        />
      )}

      {/* Popular Shows Section */}
      {trendingLoading ? (
        <SkeletonCarousel />
      ) : (
        <MovieCarousel
          key="popularshows"
          movies={trendingTVCarousel}
          title="Popular Shows"
          icon={FaTv}
        />
      )}
       {/* Last Year Section */}

      {lastYearLoading ? (
        <SkeletonCarousel />
      ) : (
        <MovieCarousel
          key="lastyear"
          movies={lastYearMovies?.data?.results || []}
          title={`Best of ${lastYear}`}
          icon={FaHeart}
        />
      )}
       {/* Top Grossing Section */}
       {topGrossingLoading ? (
        <SkeletonCarousel />
      ) : (
        <MovieCarousel
          key="topgrossing"
          movies={topGrossingMovies?.data?.results || []}
          title="Top Grossing"
          icon={FaDollarSign}
        />
      )}

      {/* Top Rated Movies Section */}
      {topRatedLoading ? (
        <SkeletonCarousel />
      ) : (
        <MovieCarousel
          key="toprated"
          movies={topRatedMovies?.data?.results || []}
          title="Top Rated"
          icon={FaStar}
        />
      )}


     

      {/* Genre Grid Section */}
      <div className="container mx-auto px-4 py-8 lg:px-8">
        <GenreGrid genres={genreFilters} />
      </div>
    </div>
  );
};

// Skeleton component for carousel loading state
const SkeletonCarousel = () => (
  <div className="container mx-auto px-4 py-8 lg:px-8">
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
);

export default MovieHomepage;
