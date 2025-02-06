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
const AnimePage = () => {

  return (
    <div className="min-h-screen  ">
      <div className="container mx-auto px-4 lg:px-8 py-6 md:py-10">
         <h3>Coming soon</h3>
      </div>
    </div>
  );
}

export default AnimePage;