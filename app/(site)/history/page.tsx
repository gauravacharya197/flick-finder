'use client'
import SectionHeader from '@/components/Common/SectionHeader';
import WatchHistory from '@/components/WatchHistory';
import React from 'react';


const HistoryPage = () => {

  return (
    <div className="min-h-screen dark:bg-gray-900 dark:text-white">
      <div className="container mx-auto px-4 lg:px-8 py-6 md:py-10">
        <SectionHeader text='Watch History' className='mb-2'/>
         <WatchHistory/>
      </div>
    </div>
  );
}

export default HistoryPage;