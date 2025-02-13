import Container from '@/components/common/Container';
import {  MediaSection } from '@/components/common/MediaSection';
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
   
    <Container>  <MediaSection mediaType={mediaType}/></Container>
    
  );
}

export default ExplorePage;
