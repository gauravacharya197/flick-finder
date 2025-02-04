
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
    <div className="min-h-screen ">
          <div className="container mx-auto px-4 lg:px-8 py-6 md:py-10">
            <SectionHeader text='Watchlist' className='mb-4'/>
           <Watchlist/>
         </div>
         </div>
  )
}
export default WatchListPage;
