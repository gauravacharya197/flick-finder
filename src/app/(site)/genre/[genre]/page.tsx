import Container from '@/components/common/Container';
import { Genre } from '@/components/genre/Genre';
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
  const { genre } =await params;
  const formattedGenre = decodeURIComponent(genre).replace(/-/g, ' ');


  return {
    title: `${capitalizeFirstLetter(formattedGenre)} - Best Popular ${formattedGenre} Movies/TV Series`,
    description: `Browse ${formattedGenre} movies and TV series on ${siteConfig.siteName}. ${siteConfig.description}`,
  };
}

const GenrePage = async ({ params }: GenrePageProps) => {
  const { genre } = await params;
  const formattedGenre = decodeURIComponent(genre).replace(/-/g, ' ');

  return (

      <Container>  <Genre value={formattedGenre}/></Container>
    
  );
}

export default GenrePage;