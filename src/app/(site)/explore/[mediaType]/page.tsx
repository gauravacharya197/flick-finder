import Container from '@/components/common/Container';
import { MediaSection } from '@/components/common/MediaSection';
import { siteConfig } from '@/config/siteConfig';
import { setMediaType } from '@/redux/movies/advanceSearchSlice';
import { MediaType } from '@/types/mediaType';
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';
import { Metadata } from 'next';
import React from 'react';

// Define the MediaType type explicitly

// Define the props interface for the ExplorePage component
interface ExplorePageProps {
  params: Promise<{
   mediaType: MediaType;
  }>;
}

export  async function generateMetadata({params}:   ExplorePageProps) {
  const mediaType = (await params).mediaType;

  const formattedMediaType = capitalizeFirstLetter(mediaType)

  return {
    title: `${formattedMediaType} - ${siteConfig.siteName} - Explore popular ${formattedMediaType}`,
    description: `Explore ${formattedMediaType} on ${siteConfig.siteName}. ${siteConfig.description}`,
  };
}

export default async function ExplorePage({params}:   ExplorePageProps) {
  const mediaType = (await params).mediaType;

  return (
    <Container>
      <MediaSection mediaType={mediaType} />
    </Container>
  );
}


