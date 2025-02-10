
import Container from '@/components/Common/Container';
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
   
    
     <Container> <Trending/></Container>
      
     
   
  )
}
export default TrendingPage;
