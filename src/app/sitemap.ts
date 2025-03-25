import axios from 'axios';
import { MetadataRoute } from 'next';

// API Base URL
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// Fetch filters safely with error handling
const getServerFilters = async () => {
  try {
    // const response = await axios.get(`${baseUrl}api/Filters`);
    // return response.data; // Ensure only data is returned
  } catch (error) {
    // console.error("Failed to fetch genres for sitemap:", error);
    // return { genres: [] }; // Return default structure to prevent crashes
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
    { url: 'https://flickday.to/explore/top-movies-tv', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];

  // Fetch dynamic genre-based sitemap entries

  const genreEntries: MetadataRoute.Sitemap = [{ url: 'https://flickday.to/genre/action', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
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
  { url: 'https://flickday.to/genre/western', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 }]

  return [...baseEntries, ...genreEntries];
}
