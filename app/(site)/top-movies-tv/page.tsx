import { TopRatedList } from '@/components/TopRatedList';
import { siteConfig } from '@/config/siteConfig';
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: `${siteConfig.siteName} - Discover Top Rated List of Movies/TV Series`,
  description: siteConfig.description,
  // other metadata
};
 const TopRated = () => {
  return (
    <div className="min-h-screen  dark:text-white">
       <div className="container mx-auto px-4 lg:px-8 py-6 md:py-10">
         <TopRatedList/>
       </div>
     </div>
  
  )
}
export default TopRated;
