'use client'

import SectionHeader from '@/components/Common/SectionHeader';
import { MovieList } from '@/components/Movie/MovieList';
import React from 'react'


 const WatchListPage = () => {


  return (
    <div className="min-h-screen dark:bg-gray-900 dark:text-white">
          <div className="container mx-auto px-4 lg:px-8 py-6 md:py-10">
            <SectionHeader text='Watchlist' className='mb-4'/>
          <MovieList movies={[{title:"sonic", voteAverage:4.4,mediaType:'tv'}]}/>
         </div>
         </div>
  )
}
export default WatchListPage;
