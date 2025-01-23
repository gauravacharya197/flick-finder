
import { Trending } from '@/components/Trending';
import { siteConfig } from '@/config/siteConfig';
import { Metadata } from 'next';
import React, {  } from 'react'
export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  // other metadata
};
const TrendingPage = () => {
 

  return (
    <section className=" overflow-hidden pb-10  dark:bg-gray-900 dark:text-white md:pt-2   xl:pt-5">
  <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
    <div className="flex flex-col lg:items-start lg:gap-3 xl:gap-4">
      <Trending/>
    </div>
  </div>
</section>
   
  )
}
export default TrendingPage;
