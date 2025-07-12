import Container from '@/components/common/Container';
import ReadManga from '@/components/manga/Read';
import { siteConfig } from '@/config/siteConfig';
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';
import React from 'react';
import { Metadata } from 'next';

export type ReadMangaProps = {
  params: Promise<{
    id: string,
    title?: string
  }>
}

export async function generateMetadata({ params }: ReadMangaProps): Promise<Metadata> {
  const { id, title } = await params;
  
  // Decode and format the title if available
  const formattedTitle = title 
    ? decodeURIComponent(title).replace(/-/g, ' ') 
    : "Manga";
  
  const capitalizedTitle = capitalizeFirstLetter(formattedTitle);
  
  // Create a clean, SEO-friendly title
  const pageTitle = `${capitalizedTitle} - Read Manga Online | ${siteConfig.siteName}`;
  
  // Create a concise description with keywords
  const description = title 
    ? `Read ${capitalizedTitle} manga online for free. ${siteConfig.description}`
    : `Find and read manga online on ${siteConfig.siteName}. ${siteConfig.description}`;

  return {
    title: pageTitle,
    description: description,
    openGraph: {
      title: pageTitle,
      description: description,
      type: 'article',
    },
    alternates: {
      canonical: `${siteConfig.url}/manga/${id}/${title}`,
    }
  };
}

export default async function ReadMangaPage({ params }: ReadMangaProps) {
  const mangaParams = await params;

  return (
    <Container>
      <h1 className="sr-only">
        {mangaParams.title 
          ? `Read ${capitalizeFirstLetter(decodeURIComponent(mangaParams.title).replace(/-/g, ' '))}` 
          : `Read Manga Online`}
      </h1>
      <ReadManga params={mangaParams} />
    </Container>
  );
}