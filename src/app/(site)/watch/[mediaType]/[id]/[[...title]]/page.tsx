import Container from '@/components/common/Container';
import { Genre } from '@/components/genre/Genre';
import Watch from '@/components/watch';
import { siteConfig } from '@/config/siteConfig';
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';
import { Metadata } from 'next';
import React from 'react';
export type WatchPageProps = {
  params: Promise<{
    mediaType: string,
    id: string,
    title?: string
  }>
}
export  async function generateMetadata({params}:   WatchPageProps) {
  const { mediaType, id, title } = await params;
  // Decode and format the title if available, otherwise use a default
  const formattedTitle = title 
    ? decodeURIComponent(title).replace(/-/g, ' ') 
    : `${capitalizeFirstLetter(mediaType)}`;
  const capitalizedTitle = capitalizeFirstLetter(formattedTitle)

  const description = title 
    ? `Watch ${capitalizedTitle} online. Explore a wide selection of free movies and TV shows on ${siteConfig.siteName}. ${siteConfig.description}`
    : `Find and watch movies and TV shows on ${siteConfig.siteName}. ${siteConfig.description}`;

  return {
    title: `${capitalizedTitle} - Watch ${capitalizedTitle} Online | ${siteConfig.siteName}`,
    description,
  };
}

export default async function WatchPage({params}:   WatchPageProps) {
  const genre = (await params);

  return (
    <Container >
      <Watch params={genre}/>
    </Container>
  );
}