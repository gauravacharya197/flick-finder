
import { Trending } from '@/components/Trending';
import { Metadata } from 'next';
import React, {  } from 'react'
export const metadata: Metadata = {
  title: "FlickFinder - Pick movie of based on your emotion",
  description: "Home of your favorite Movies",
  // other metadata
};
const TrendingPage = () => {
 

  return (
    <section className=" overflow-hidden pb-5  dark:bg-gray-900 dark:text-white md:pt-5 xl:pb-5 xl:pt-15">
  <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
    <div className="flex flex-col lg:items-start lg:gap-3 xl:gap-4">
      <Trending/>
    </div>
  </div>
</section>
   
  )
}
export default TrendingPage;
