import { Metadata } from "next";
import { siteConfig } from "@/config/siteConfig";
import MovieHomepage from "./home/page";
import Container from "@/components/common/Container";

export const metadata: Metadata = {
  title: `${siteConfig.title}`,
  description: `${siteConfig.description}`,
  keywords: ['free movies', 'TV shows online', 'streaming', 'watch online', 'HD movies', siteConfig.siteName],
  alternates: {
    canonical: siteConfig.url,
  },
 authors: [
    { name: 'Flickday', url: siteConfig.url },
  ],
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.siteName,
    type: 'website',
  },
};

export default function HomePage() {
  return (
   
      <MovieHomepage />
 
  );
}