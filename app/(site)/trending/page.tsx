
import { Trending } from '@/components/Trending';
import { siteConfig } from '@/config/siteConfig';
import { Metadata } from 'next';
import React, {  } from 'react'
export const metadata: Metadata = {
  title: `${siteConfig.siteName} - Discover Trending Movies/TV Series`,
  description: siteConfig.description,
  // other metadata
};
const TrendingPage = () => {
 

  return (
   
       <div className="min-h-screen ">
       <div className="container mx-auto px-4 lg:px-8 py-6 md:py-10">
      <Trending/>
      </div>
      </div>
     
   
  )
}
export default TrendingPage;
