"use client";

import MovieCarousel from "@/components/common/MovieCarousel";
import FeaturedMovie from "@/components/movie/FeaturedMovie";
import GenreGrid from "@/components/filter/GenreGrid";
import { RootState } from "@/redux/store";
import { getMovies } from "@/services/MovieService";
import { useInfiniteQuery, useQueries, useQuery } from "@tanstack/react-query";
import {
  FaDollarSign,
  FaFire,
  FaHeart,
  FaImdb,
  FaStar,
  FaTv,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import Skeleton from "@/components/common/Skeleton";
import { CardLoadingSkeleton } from "@/components/common/CardLoadingSkeleton";
import { featuredMediaCategories } from "@/constants/featuredMediaCategory";
import Head from "next/head";
import { useEffect } from "react";
import FlickdayHomepageContent from "./SEO";

const MovieHome = () => {
  const { genres: genreFilters } = useSelector(
    (state: RootState) => state.filters
  );
  const lastYear = new Date().getFullYear() - 1;
  const currentYear = new Date().getFullYear();
  
  const {
    data: trendingMovies,
    isLoading: trendingLoading,
  } = useInfiniteQuery({
    queryKey: ["trending", "AllTrending"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = getMovies("Trending");
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

  const queries = useQueries({
    queries: featuredMediaCategories.map((category) => {
      return {
        queryKey: ['movies', `featureMovies${category.id}`],
        queryFn: () => getMovies(category.id),
        staleTime: 1000 * 60 * 60 * 24,
      } 
    })
  });

  // Filter TV shows from trending movies for Popular Shows section
  const trending =
    trendingMovies?.pages.flatMap((page) => page.data.results) || [];
  const featuredMovie = trending[0];

  // Split remaining movies into two groups of 10 for carousels
  const remainingMovies = trending.slice(1);
  const trendingMovieCarousel = remainingMovies.filter(
    (x) => x.mediaType == "movie"
  );
  const trendingTVCarousel = remainingMovies.filter((x) => x.mediaType == "tv");

  // SEO structured data


  return (
    <>
      

      <div className="min-h-screen text-white">
        {/* SEO Header Section */}
        <header className="sr-only">
          <h1>FlickDay - Your Ultimate Movie and TV Show Discovery Platform</h1>
          <p>
            Explore trending movies, discover top-rated films, watch popular TV shows, 
            and find the best entertainment content of {currentYear}. From blockbuster hits 
            to hidden gems, FlickDay helps you discover your next favorite movie or series.
          </p>
        </header>

        {/* Hero Section */}
        <section aria-label="Featured Movie" className="mb-8">
          {trendingLoading ? (
            <div className="">
              <Skeleton
                showTitle={false}
                rows={8}
                rowWidths={
                  [
                    "100%",
                    "100%",
                    "100%",
                    "100%",
                    "50%",
                    "50%",
                    "50%",
                    "50%",
                  ] as any
                }
                className="rounded-lg mt-3 mb-4 px-4"
                titleHeight="h-8"
                rowHeight="h-5"
                spacing="space-y-6"
              />
            </div>
          ) : (
            <FeaturedMovie movie={featuredMovie} />
          )}
        </section>

        {/* Main Content Sections */}
        <main>
          {/* Trending Movies Section */}
          <section aria-label="Trending Movies" className="mb-8">
            {trendingLoading ? (
              <CardLoadingSkeleton />
            ) : (
              <MovieCarousel
                autoplay={true}
                key="trending"
                movies={trendingMovieCarousel || []}
                title="Trending Now"
                icon={FaFire}
              />
            )}
          </section>

          {/* Popular Shows Section */}
          <section aria-label="Popular TV Shows" className="mb-8">
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
          </section>

          {/* Genre Filter Section */}
          <section aria-label="Browse by Genre" className="px-4 mb-8">
            <h2 className="sr-only">Browse Movies and Shows by Genre</h2>
            <GenreGrid genres={genreFilters} />
          </section>

          {/* Recently Updated Section */}
          <section aria-label="Recently Updated Movies" className="mb-8">
            {recentMoviesLoading ? (
              <CardLoadingSkeleton />
            ) : (
              <MovieCarousel
                key="recent"
                movies={recentMovies?.data?.results || []}
                title="Recently Updated"
                icon={FaImdb}
                autoplay={true}
              />
            )}
          </section>

          {/* Featured Categories Sections */}
          {queries.map((query, index) => {
            const category = featuredMediaCategories[index];
            const movieData = query.data as any;

            if (query.isLoading) {
              return <CardLoadingSkeleton key={`skeleton-${category.id}`} />;
            }

            if (movieData?.data?.results?.length > 0) {
              return (
                <section 
                  key={category.name}
                  aria-label={`${category.displayName} Movies`}
                  className="mb-8"
                >
                  <MovieCarousel
                    movies={[...movieData.data.results].reverse()}
                    title={category.displayName}
                    icon={category.icon}
                    autoplay={true}
                  />
                </section>
              );
            }

            return null;
          })}

          {/* Best of Last Year Section */}
          <section aria-label={`Best Movies of ${lastYear}`} className="mb-8">
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
          </section>

          {/* Top Grossing Section */}
          <section aria-label="Top Grossing Movies" className="mb-8">
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
          </section>

          {/* Top Rated Movies Section */}
          <section aria-label="Top Rated Movies" className="mb-8">
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
          </section>
        </main>

        {/* SEO Footer Content */}
        <FlickdayHomepageContent/>
        
      </div>
    </>
  );
};

export default MovieHome;