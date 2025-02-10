import Container from '@/components/Common/Container';
import { Genre } from '@/components/Genre/Genre';
import Watch from '@/components/Watch';
import { siteConfig } from '@/config/siteConfig';
import { WatchPageProps } from '@/types/WatchPageProps';
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';
import { Metadata } from 'next';
import React from 'react';



// Generate dynamic metadata
export async function generateMetadata(
  { params }: WatchPageProps
): Promise<Metadata> {
  const { mediaType, id, title } = params;
  // Decode and format the title if available, otherwise use a default
  const formattedTitle = title 
    ? decodeURIComponent(title).replace(/-/g, ' ') 
    : `${capitalizeFirstLetter(mediaType)}`;
  const capitalizedTitle = capitalizeFirstLetter(formattedTitle)

  const description = title 
    ? `Watch ${capitalizedTitle} online. Explore a wide selection of ${capitalizedTitle} movies and TV shows on ${siteConfig.siteName}. ${siteConfig.description}`
    : `Discover and watch movies and TV shows on ${siteConfig.siteName}. ${siteConfig.description}`;

  return {
    title: `${capitalizedTitle} - Watch ${capitalizedTitle} Online | ${siteConfig.siteName}`,
    description,
  };
}

const WatchPage = ({ params }: WatchPageProps) => {
  return (
   
   
    <Container>  <Watch params={params} /></Container>
       
  );
};


export default WatchPage;