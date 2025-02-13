
import Container from '@/components/common/Container';
import SectionHeader from '@/components/common/SectionHeader';
import { MovieList } from '@/components/movie/MovieList';
import { Watchlist } from '@/components/watchlist';
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
