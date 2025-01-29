'use client'

import MovieCarousel from '@/components/Common/MovieCarousel';
import FeaturedMovie from '@/components/Movie/FeaturedMovie';
import { siteConfig } from '@/config/siteConfig';
import useMetadata from '@/hooks/useMetaData';
import { RootState } from '@/redux/store';
import { discover } from '@/services/MovieService';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from 'antd';
import { useSelector } from 'react-redux';
const MovieHomepage = () => {
  useMetadata(siteConfig.siteName, '');
  
  const { countries, genres, years, sortBy, mediaType } = useSelector(
    (state: RootState) => state.advanceSearch
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ['homepage', "", sortBy, genres, years, countries, mediaType],
    queryFn: async () => {
      const response = await discover(1, "", '', '', '', "all", '');
      return response;
    },
    retry: 1
  });

  const movies = data?.data.results || [];
  const featuredMovie = movies[0];
  
  // Split remaining movies into two groups of 10 for carousels
  const remainingMovies = movies.slice(1);
  const firstCarouselMovies = remainingMovies.slice(0, 10);
  const secondCarouselMovies = remainingMovies.slice(10, 20);

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Error loading movies. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      {isLoading ? (
        <div className="w-full h-[60vh]">
          <Skeleton className="w-full h-full" />
        </div>
      ) : (
        <FeaturedMovie movie={featuredMovie} />
      )}

      {/* Trending Section with Carousel */}
      {isLoading ? (
        <div className="p-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="flex gap-4">
            {[...Array(5)].map((_, index) => (
              <Skeleton
                key={index}
                className="w-[200px] h-[300px] rounded-lg"
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
        <div className="p-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="flex gap-4">
            {[...Array(5)].map((_, index) => (
              <Skeleton
                key={index}
                className="w-[200px] h-[300px] rounded-lg"
              />
            ))}
          </div>
        </div>
      ) : (
        <MovieCarousel
          key={1}
          movies={secondCarouselMovies}
          title="This week popular"
        />
      )}
    </div>
  );
};

export default MovieHomepage;