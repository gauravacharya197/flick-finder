import { featuredMediaCategories } from '@/constants/featuredMediaCategory';
import { constructWatchUrl } from '@/utils/constructWatchUrl';
import axios from 'axios';
import { MetadataRoute } from 'next';

// API Base URL
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fetch server-side data safely with error handling
const getServerData = async () => {
  try {
    const topRated = await axios.get(`${baseUrl}Movies/Toprated`);
    const trending = await axios.get(`${baseUrl}Movies/trending`);
    const featuredCategoryData = await Promise.all(
      featuredMediaCategories.map(async (category) => {
        try {
          const response = await axios.get(`${baseUrl}Movies/${category.id}`);
          return response.data || { results: [] }; // Ensure consistent structure
        } catch (error) {
          console.error(`Failed to fetch data for category ${category.id}:`, error);
          return { results: [] }; // Return empty results to match structure
        }
      })
    );

    return {
      topRated: topRated.data || { results: [] },
      trending: trending.data || { results: [] },
      featuredCategories: featuredCategoryData,
    };
  } catch (error) {
    console.error("Failed to fetch data for sitemap:", error);
    return {
      topRated: { results: [] },
      trending: { results: [] },
      featuredCategories: []
    };
  }
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base sitemap entries
  const baseEntries: MetadataRoute.Sitemap = [
    { url: 'https://flickday.to', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: 'https://flickday.to/trending', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://flickday.to/explore/movie', lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: 'https://flickday.to/explore/tv', lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: 'https://flickday.to/explore/manga', lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: 'https://flickday.to/results', lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ];

  // Pre-defined genre entries
  const genreEntries: MetadataRoute.Sitemap = [
    { url: 'https://flickday.to/genre/action', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://flickday.to/genre/adventure', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://flickday.to/genre/animation', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://flickday.to/genre/comedy', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://flickday.to/genre/crime', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://flickday.to/genre/documentary', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://flickday.to/genre/drama', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://flickday.to/genre/family', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://flickday.to/genre/fantasy', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://flickday.to/genre/history', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://flickday.to/genre/horror', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://flickday.to/genre/music', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://flickday.to/genre/mystery', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://flickday.to/genre/romance', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://flickday.to/genre/science-fiction', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://flickday.to/genre/tv-movie', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://flickday.to/genre/thriller', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://flickday.to/genre/war', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://flickday.to/genre/western', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 }
  ];

  // Fetch dynamic server data
  const { topRated, trending, featuredCategories } = await getServerData();

  // Dynamic entries for top-rated movies/shows
  const topRatedEntries: MetadataRoute.Sitemap = topRated.results.map((item) => ({
    url: `https://flickday.to${constructWatchUrl(item?.mediaType, item?.id, item?.displayTitle)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6
  }));

  // Dynamic entries for trending movies/shows
  const trendingEntries: MetadataRoute.Sitemap = trending.results.map((item) => ({
    url: `https://flickday.to${constructWatchUrl(item?.mediaType, item?.id, item?.displayTitle)}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.6
  }));

  // Dynamic entries for featured categories
  const featuredEntries: MetadataRoute.Sitemap = featuredCategories.flatMap((categoryData) => 
    categoryData.results.map((item) => ({
      url: `https://flickday.to${constructWatchUrl(item?.mediaType, item?.id, item?.displayTitle)}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6
    }))
  );

  // Combine all entries
  return [
    ...baseEntries,
    ...genreEntries,
    ...topRatedEntries,
    ...trendingEntries,
    ...featuredEntries
  ];
}