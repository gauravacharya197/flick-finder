// History Page
import Container from '@/components/common/Container';
import SectionHeader from '@/components/common/SectionHeader';
import WatchHistory from '@/components/watchHistory';
import { siteConfig } from '@/config/siteConfig';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: `Watch History | ${siteConfig.siteName}`,
  description: `View and manage your complete watch history on ${siteConfig.siteName}. Track all the movies and TV shows you've watched`,
  openGraph: {
    title: `Watch History | ${siteConfig.siteName}`,
    description: `View and manage your complete watch history on ${siteConfig.siteName}. Track all the movies and TV shows you've watched.`,
    type: 'website',
    url: `${siteConfig.url}/history`,
  },
};

const HistoryPage = () => {
  return (
    <Container>
      <SectionHeader 
        text='Watch History' 
        className='mb-2'
      />
      <WatchHistory />
    </Container>
  );
}

export default HistoryPage;