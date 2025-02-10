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
   
    <section className="pb-10  pt-5 md:pt-5 xl:pt-11">
    <div className="mx-auto  px-4 md:px-8 2xl:px-0">
      <div className="flex flex-col lg:items-start lg:gap-3 xl:gap-4 container mx-auto">
      <Watch params={params} />
        </div>
      </div>
    </section>
  );
};


export default WatchPage;