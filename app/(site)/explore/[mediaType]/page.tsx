import {  MediaSection } from '@/components/Common/MediaSection';
import { siteConfig } from '@/config/siteConfig';
import { MediaType } from '@/types/mediaType';
import { Metadata } from 'next';
import React from 'react';

interface ExploreProps {
  params: {
    mediaType: string; // Accept string first for validation
  };
}

// Helper function to validate mediaType
const getValidMediaType = (mediaType: string): MediaType => {
  return mediaType === "tv" || mediaType === "movie" ? mediaType : "movie";
};

// Generate dynamic metadata
export async function generateMetadata(
  { params }: ExploreProps
): Promise<Metadata> {
  
  const mediaType = getValidMediaType(params.mediaType);
  const formattedMediaType = mediaType=='movie'? "Movies" : "TV Shows"

  return {
    title: `${formattedMediaType} - ${siteConfig.siteName} - Explore popular ${formattedMediaType}`,
    description: `Explore ${formattedMediaType} on ${siteConfig.siteName}. ${siteConfig.description}`,
  };
}

const ExplorePage = ({ params }: ExploreProps) => {
  const mediaType: MediaType = getValidMediaType(params.mediaType);

  return (
    <div className="min-h-screen dark:text-white">
      <div className="container mx-auto px-4 lg:px-8 py-6 md:py-10">
      <MediaSection mediaType={mediaType}/>
      </div>
    </div>
  );
}

export default ExplorePage;
