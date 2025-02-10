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
const HistoryPage = () => {

  return (
  
       <Container>
          <SectionHeader text='Watch History' className='mb-2'/>
           <WatchHistory/>
       </Container>
     
  );
}

export default HistoryPage;