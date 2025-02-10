import { Genre } from '@/components/Genre/Genre';
import { siteConfig } from '@/config/siteConfig';
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';
import { Metadata } from 'next';
import React from 'react';

interface GenrePageProps {
  params: {
    genre: string
  }
}

// Generate dynamic metadata
export async function generateMetadata(
  { params }: GenrePageProps
): Promise<Metadata> {
  const { genre } = params;
  const formattedGenre = decodeURIComponent(genre).replace(/-/g, ' ');


  return {
    title: `${capitalizeFirstLetter(formattedGenre)} - Best Popular ${formattedGenre} Movies/TV Series`,
    description: `Browse ${formattedGenre} movies and TV series on ${siteConfig.siteName}. ${siteConfig.description}`,
  };
}

const GenrePage = ({ params }: GenrePageProps) => {
  const { genre } = params;
  const formattedGenre = decodeURIComponent(genre).replace(/-/g, ' ');

  return (
    <div className="min-h-screen  dark:text-white">
      <div className="container mx-auto px-4 lg:px-8 py-6 md:py-10">
        <Genre value={formattedGenre}/>
      </div>
    </div>
  );
}

export default GenrePage;