import Container from '@/components/Common/Container';
import SectionHeader from '@/components/Common/SectionHeader';
import WatchHistory from '@/components/WatchHistory';
import { siteConfig } from '@/config/siteConfig';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: `${siteConfig.siteName} - Watch History`,
  description: siteConfig.description,
  // other metadata
};
const AnimePage = () => {

  return (
    
         <Container><h3>Coming soon</h3></Container>
     
  );
}

export default AnimePage;