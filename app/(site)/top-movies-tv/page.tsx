import Container from '@/components/Common/Container';
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
   
         <Container><TopRatedList/></Container>
      
  
  )
}
export default TopRated;
