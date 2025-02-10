
import Container from '@/components/Common/Container';
import SectionHeader from '@/components/Common/SectionHeader';
import { MovieList } from '@/components/Movie/MovieList';
import { Watchlist } from '@/components/Watchlist';
import { siteConfig } from '@/config/siteConfig';
import { Metadata } from 'next';
import React from 'react'
export const metadata: Metadata = {
  title: `${siteConfig.siteName} - WatchList`,
  description: siteConfig.description,
  // other metadata
};

 const WatchListPage = () => {


  return (
   
          <Container>
              <SectionHeader text='Watchlist' className='mb-4'/>
             <Watchlist/>
         
          </Container>
  )
}
export default WatchListPage;
