"use client";

import MovieCarousel from "@/components/Common/MovieCarousel";
import FeaturedMovie from "@/components/Movie/FeaturedMovie";
import GenreGrid from "@/components/SearchFilter/GenreGrid";
import { siteConfig } from "@/config/siteConfig";
import useMetadata from "@/hooks/useMetaData";
import { RootState } from "@/redux/store";
import { discover, getTrending } from "@/services/MovieService";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Skeleton } from "antd";
import { useSelector } from "react-redux";
const MovieHomepage = () => {
  useMetadata(siteConfig.siteName, "");

  const { genres: genreFilters } = useSelector(
    (state: RootState) => state.filters,
  );
  const lastYear = new Date().getFullYear() - 1;

  const { error, isError, data, isLoading } = useInfiniteQuery({
    queryKey: ["trending", "All"],
    queryFn: async ({ pageParam = 1 }) => {const response = await getTrending("All", "day", pageParam.toString());
      return response;
    },
    getNextPageParam: () => {
      return null;
    },
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

  const movies = data?.pages.flatMap((page) => page.data.results) || [];
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
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <p>Error loading movies. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      {isLoading ? (
        <div className="container mx-auto px-4 py-8 lg:px-8 ">
          <Skeleton active className="h-full w-full" />
        </div>
      ) : (
        <FeaturedMovie movie={featuredMovie} />
      )}

      {/* Trending Section with Carousel */}
      {isLoading ? (
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
          title="Trending Now 🔥"
        />
      )}

      {/* New Releases Carousel */}
      {isLoading ? (
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
          key={1}
          movies={popularMovies?.data.results || []}
          title={`Best of ${lastYear}`}
        />
      )}
      <div className="container mx-auto px-4 py-8 lg:px-8 ">
        <GenreGrid genres={genreFilters} />
      </div>
    </div>
  );
};

export default MovieHomepage;
