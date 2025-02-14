import { Cast } from '@/components/cast';
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
interface CastPageProps {
  params: Promise<{
   castId: string;
  }>;
}

export  async function generateMetadata({params}:   CastPageProps) {
  const mediaType = (await params).castId;

  const formattedMediaType = capitalizeFirstLetter(mediaType)

  return {
    title: `${formattedMediaType} - ${siteConfig.siteName} - Explore popular ${formattedMediaType}`,
    description: `Explore ${formattedMediaType} on ${siteConfig.siteName}. ${siteConfig.description}`,
  };
}

export default async function CastPage({params}:   CastPageProps) {
  const mediaType = (await params).castId;

  return (
    <Container>
      <Cast castId={mediaType} />
    </Container>
  );
}


