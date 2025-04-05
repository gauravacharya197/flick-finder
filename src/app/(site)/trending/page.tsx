import Container from '@/components/common/Container';
import { Trending } from '@/components/trending';
import { siteConfig } from '@/config/siteConfig';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: `Trending Movies & TV Shows | ${siteConfig.siteName}`,
  description: `Browse the most popular movies and TV series.`,
  keywords: 'trending movies, popular TV shows, new releases, top rated entertainment, streaming guide, what to watch',
  openGraph: {
    title: `Trending Movies & TV Shows | ${siteConfig.siteName}`,
    description: `. Browse the most popular movies and TV series.`,
    type: 'website',
    url: `${siteConfig.url}/trending`,
  },
 
};

const TrendingPage = () => {
  return (
    <Container>
      
      <Trending />
    </Container>
  );
}

export default TrendingPage;