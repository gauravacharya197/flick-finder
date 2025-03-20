import Container from '@/components/common/Container';
import ReadManga from '@/components/manga/Read';
import { siteConfig } from '@/config/siteConfig';
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';
import React from 'react';
export type ReadMangaProps = {
  params: Promise<{
    id: string,
    title?: string
  }>
}
export  async function generateMetadata({params}:   ReadMangaProps) {
  const {  id, title } = await params;
  // Decode and format the title if available, otherwise use a default
  const formattedTitle = title 
    ? decodeURIComponent(title).replace(/-/g, ' ') 
    : `${"Manga"}`;
  const capitalizedTitle = capitalizeFirstLetter(formattedTitle)

  const description = title 
    ? `Read ${capitalizedTitle} online. Explore a wide selection of free Manga on ${siteConfig.siteName}. ${siteConfig.description}`
    : `Find and watch movies and TV shows and Manga on ${siteConfig.siteName}. ${siteConfig.description}`;

  return {
    title: `${capitalizedTitle} - Read ${capitalizedTitle} Manga Online | ${siteConfig.siteName}`,
    description,
  };
}

export default async function WatchPage({params}:   ReadMangaProps) {
  const genre = (await params);

  return (
    <Container >
      <ReadManga params={genre}/>
    </Container>
  );
}