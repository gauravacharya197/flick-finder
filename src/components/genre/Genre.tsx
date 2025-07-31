'use client'
import React, { useState, useMemo } from 'react'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/redux/store'
import { setMediaType } from '@/redux/movies/advanceSearchSlice'
import { MovieList } from '../movie/MovieList'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { discover, getTopRated, getTrending } from '@/services/MovieService'
import SectionHeader from '../common/SectionHeader'
import ErrorMessage from '../common/ErrorMessage'
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter'
import Skeleton from '../common/Skeleton'
import { Segmented } from '../ui/Segmented'

interface GenreProps {
  value: string
}

interface SortOption {
  value: string
  label: string
}

interface FilterStats {
  totalResults: number
  averageRating: number
  releaseYearRange: {
    min: number
    max: number
  }
}

export const Genre = ({ value }: GenreProps) => {
  const { mediaType } = useSelector((state: RootState) => state.advanceSearch)
  const dispatch = useDispatch()
  const { genres } = useSelector((state: any) => state.filters)
  
  const [sortBy, setSortBy] = useState('popularity.desc')
  const [showStats, setShowStats] = useState(false)

  const genre = genres.find((x: any) => x.name.toLowerCase() === value.toLowerCase())
  const genreId = genre ? genre.externalId : null

  const sortOptions: SortOption[] = [
    { value: 'popularity.desc', label: 'Most Popular' },
    { value: 'vote_average.desc', label: 'Highest Rated' },
    { value: 'release_date.desc', label: 'Newest First' },
    { value: 'release_date.asc', label: 'Oldest First' },
    { value: 'revenue.desc', label: 'Highest Grossing' },
    { value: 'vote_count.desc', label: 'Most Voted' }
  ]

  const {
    error,
    isError,
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    refetch
  } = useInfiniteQuery({
    queryKey: ['genre', mediaType, genreId, sortBy],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await discover({
        pageNumber: pageParam,
        genre: genreId,
        mediaType: mediaType,
        sortBy: sortBy
      })
      return response
    },
    enabled: !!genreId,
    getNextPageParam: (lastPage, pages) => {
      const totalPages = lastPage.data.totalPages
      const currentPage = pages.length
      return currentPage < totalPages ? currentPage + 1 : undefined
    },
    initialPageParam: 1,
    retry: 1
  })

  // Query for top rated items in this genre for featured section
  const { data: topRatedData } = useQuery({
    queryKey: ['topRated', mediaType, genreId],
    queryFn: async () => {
      const response = await discover({
        pageNumber: 1,
        genre: genreId,
        mediaType: mediaType,
        sortBy: 'vote_average.desc',
      })
      return response
    },
    enabled: !!genreId,
    staleTime: 1000 * 60 * 30 // Cache for 30 minutes
  })

  const observerRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetching,
  })

  const movies = data?.pages.flatMap((page) => page.data.results) || []
  const topRatedMovies = topRatedData?.data.results?.slice(0, 5) || []

  // Calculate statistics
  const filterStats: FilterStats | null = useMemo(() => {
    if (!data?.pages.length) return null
    
    const allMovies = data.pages.flatMap(page => page.data.results)
    const totalResults = data.pages[0]?.data.totalResults || 0
    
    const ratings = allMovies.map(movie => movie.vote_average).filter(rating => rating > 0)
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
      : 0

    const years = allMovies
      .map(movie => {
        const date = movie.release_date || movie.first_air_date
        return date ? new Date(date).getFullYear() : null
      })
      .filter(year => year !== null) as number[]

    const releaseYearRange = years.length > 0 
      ? { min: Math.min(...years), max: Math.max(...years) }
      : { min: 0, max: 0 }

    return {
      totalResults,
      averageRating,
      releaseYearRange
    }
  }, [data])

  const genreDescription = useMemo(() => {
    const descriptions: Record<string, string> = {
      action: "High-octane thrills, explosive sequences, and adrenaline-pumping adventures that keep you on the edge of your seat.",
      adventure: "Epic journeys, daring quests, and exciting expeditions that transport you to extraordinary worlds.",
      animation: "Creative storytelling through the art of animation, bringing imaginative characters and worlds to life.",
      comedy: "Laugh-out-loud moments, witty dialogue, and humorous situations designed to entertain and amuse.",
      crime: "Gripping tales of law and disorder, featuring complex investigations, heists, and criminal underworlds.",
      documentary: "Real-life stories, factual investigations, and educational content that inform and inspire.",
      drama: "Emotionally engaging narratives that explore the human condition through compelling characters and situations.",
      family: "Wholesome entertainment suitable for all ages, featuring heartwarming stories and positive messages.",
      fantasy: "Magical realms, mythical creatures, and supernatural elements that ignite the imagination.",
      history: "Stories from the past that bring historical events, figures, and periods to vivid life.",
      horror: "Spine-chilling tales designed to frighten, surprise, and create suspenseful atmospheric tension.",
      music: "Rhythm, melody, and musical performances that celebrate the power and beauty of sound.",
      mystery: "Puzzling plots, hidden secrets, and investigative stories that challenge viewers to solve along.",
      romance: "Love stories, passionate relationships, and emotional connections that warm the heart.",
      'science fiction': "Futuristic concepts, advanced technology, and speculative scenarios that explore what could be.",
      'tv movie': "Made-for-television productions that deliver quality storytelling in a broadcast format.",
      thriller: "Intense suspense, psychological tension, and edge-of-your-seat excitement throughout.",
      war: "Epic battles, military conflicts, and stories of courage during humanity's most challenging times.",
      western: "Tales of the American frontier, featuring cowboys, outlaws, and life in the untamed West."
    }
    
    return descriptions[value.toLowerCase()] || `Discover the best ${value.toLowerCase()} movies and TV shows.`
  }, [value])

  if (!genreId) {
    return (
      <div className="text-center py-8">
        <ErrorMessage message={`Genre "${value}" not found.`} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <SectionHeader className="pb-2 pt-2" text={capitalizeFirstLetter(value)} />
        
        {/* Genre Description */}
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {genreDescription}
          </p>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Segmented
            size="large"
            value={mediaType}
            options={['Movie', 'TV']}
            onChange={(value) => dispatch(setMediaType(value))}
          />
          
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <button
              onClick={() => setShowStats(!showStats)}
              className="px-3 py-2 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            >
              {showStats ? 'Hide Stats' : 'Show Stats'}
            </button>
          </div>
        </div>

        {/* Statistics Panel */}
        {showStats && filterStats && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Genre Statistics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {filterStats.totalResults.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total {mediaType === 'Movie' ? 'Movies' : 'Shows'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {filterStats.averageRating.toFixed(1)}★
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Average Rating
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {filterStats.releaseYearRange.min} - {filterStats.releaseYearRange.max}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Year Range
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Top Rated Section */}
      {topRatedMovies.length > 0 && !isLoading && (
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="text-yellow-500">⭐</span>
            Top Rated {capitalizeFirstLetter(value)} {mediaType === 'Movie' ? 'Movies' : 'Shows'}
          </h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <MovieList movies={topRatedMovies} showFeaturedMovie={false} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            All {capitalizeFirstLetter(value)} {mediaType === 'Movie' ? 'Movies' : 'Shows'}
          </h3>
          {filterStats && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Showing {movies.length} of {filterStats.totalResults.toLocaleString()} results
            </span>
          )}
        </div>

        {isLoading ? (
          <Skeleton 
            showTitle={false}
            rows={8}
            rowWidths={['100%', '100%', '100%', '100%', '50%', '50%', '50%', '50%'] as any}
            className="rounded-lg"
            titleHeight="h-8"
            rowHeight="h-5"
            spacing="space-y-6"
          />
        ) : isError ? (
          <div className="space-y-4">
            <ErrorMessage
              className='w-full'
              message={error?.message || "Something went wrong while fetching content."}
            />
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-4xl mb-4">🎬</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No {mediaType === 'Movie' ? 'Movies' : 'Shows'} Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We couldn't find any {value.toLowerCase()} {mediaType === 'Movie' ? 'movies' : 'shows'} with the current filters.
            </p>
            <button
              onClick={() => {
                setSortBy('popularity.desc')
                refetch()
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <MovieList movies={movies} showFeaturedMovie />
            
            {/* Loading Indicator */}
            {hasNextPage && (
              <div ref={observerRef} className="loading-indicator py-6 flex justify-center">
                {isFetching && (
                  <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Loading more {value.toLowerCase()} {mediaType === 'Movie' ? 'movies' : 'shows'}...
                    </span>
                  </div>
                )}
              </div>
            )}
            
            {/* End Message */}
            {!hasNextPage && movies.length > 0 && (
              <div className="text-center py-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-2xl mb-2">🎉</div>
                <p className="text-gray-600 dark:text-gray-400">
                  You've explored all {filterStats?.totalResults.toLocaleString()} {value.toLowerCase()} {mediaType === 'Movie' ? 'movies' : 'shows'}!
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Try changing the sort order or media type to discover more content.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}