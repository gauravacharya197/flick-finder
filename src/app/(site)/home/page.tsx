// HomePage
import Container from '@/components/common/Container';
import SectionHeader from '@/components/common/SectionHeader';
import MovieHome from '@/components/home/MovieHome';
import WatchHistory from '@/components/watchHistory';
import { siteConfig } from '@/config/siteConfig';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: ['free movies', 'TV shows online', 'streaming', 'watch online', 'HD movies', siteConfig.siteName],
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    type: 'website',
    url: 'https://flickday.to',
  },
  other: {
    // JSON-LD structured data
    'script:ld+json': JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "FlickDay",
      "url": siteConfig.url,
      "description": siteConfig.description,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${siteConfig.url}/search?q={search_term_string}` ,
        "query-input": "required name=search_term_string"
      },
      "publisher": {
        "@type": "Organization",
        "name": "FlickDay",
        "url": siteConfig.url,
      }
    })
  }
};

const HomePage = () => {
  return (
    <>
   <MovieHome/>
    </>
  );
}

export default HomePage;