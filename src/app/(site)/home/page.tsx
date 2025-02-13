"use client";

import MovieCarousel from "@/components/common/MovieCarousel";
import FeaturedMovie from "@/components/movie/FeaturedMovie";
import GenreGrid from "@/components/filter/GenreGrid";
import { RootState } from "@/redux/store";
import { getMovies } from "@/services/MovieService";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { FaDollarSign, FaFire, FaHeart, FaImdb, FaStar, FaTv } from "react-icons/fa";
import { useSelector } from "react-redux";
import Skeleton from "@/components/common/Skeleton";
import { CardLoadingSkeleton } from "@/components/common/CardLoadingSkeleton";
const MovieHomepage = () => {
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

  const { data: recentMovies, isLoading: recentMoviesLoading } = useQuery({
    queryKey: ["movies", "Recent"],
    queryFn: () => getMovies("Default"),
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
        <div className="px-4 lg:px-12 2xl:px-48">
<Skeleton 
        showTitle={false}
        rows={8}
        rowWidths={['100%', '100%', '100%', '100%', '50%', '50%', '50%', '50%'] as any}
        className="rounded-lg mt-3"
        titleHeight="h-8"
        rowHeight="h-5"
        spacing="space-y-6"
      />        </div>
      ) : (
        <FeaturedMovie movie={featuredMovie} />
      )}

      {/* Trending Movies Section */}
      {trendingLoading ? (
        <CardLoadingSkeleton />
      ) : (
        <MovieCarousel
          key="trending"
          movies={trendingMovieCarousel || []}
          title="Trending Now"
          icon={FaFire}
          variant="trending"
        />
      )}
      

      {/* Popular Shows Section */}
      {trendingLoading ? (
        <CardLoadingSkeleton />
      ) : (
        <MovieCarousel
          key="popularshows"
          movies={trendingTVCarousel}
          title="Popular Shows"
          icon={FaTv}
            variant="trending"
        />
      )}
       {/* Last Year Section */}
       <div className="px-4 lg:px-12 2xl:px-48">
        <GenreGrid genres={genreFilters} />
      </div>

      {recentMoviesLoading ? (
        <CardLoadingSkeleton />
      ) : (
        <MovieCarousel
          key="recent"
          movies={recentMovies?.data?.results || []}
          title="Recently Updated"
          icon={FaImdb}
        />
      )}

      {lastYearLoading ? (
        <CardLoadingSkeleton />
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
        <CardLoadingSkeleton />
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
        <CardLoadingSkeleton />
      ) : (
        <MovieCarousel
          key="toprated"
          movies={topRatedMovies?.data?.results || []}
          title="Top Rated"
          icon={FaStar}
        />
      )}

      


     

      {/* Genre Grid Section */}
      
    </div>
  );
};

// Skeleton component for carousel loading state


export default MovieHomepage;
