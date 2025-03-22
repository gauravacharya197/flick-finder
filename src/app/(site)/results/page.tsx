import { siteConfig } from "@/config/siteConfig";
import SearchResult from "@/components/search/SearchResult";
import React from "react";
import { Metadata } from "next";
import Container from "@/components/common/Container";

type ResultsPageProps = {
  searchParams: Promise<{ query?: string }>;
}

export async function generateMetadata({ searchParams }: ResultsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = params?.query?.trim() || "";
  const hasValidQuery = query.length > 0;
  
  const title = hasValidQuery
    ? `Search Results for "${query}" | ${siteConfig.siteName}`
    : `Search Movies & TV Shows | ${siteConfig.siteName}`;
    
  const description = hasValidQuery
    ? `Explore movies and TV shows related to "${query}" on ${siteConfig.siteName}. Find the best streaming content matching your search.`
    : `Search for your favorite movies and TV shows on ${siteConfig.siteName}. ${siteConfig.description}`;

  return {
    title,
    description,
    keywords: hasValidQuery 
      ? [query, `${query} movies`, `${query} TV shows`, `watch ${query}`, siteConfig.siteName]
      : ['search movies', 'search TV shows', 'online streaming', siteConfig.siteName],
    alternates: {
      canonical: hasValidQuery 
        ? `${siteConfig.url}/search?query=${encodeURIComponent(query)}`
        : `${siteConfig.url}/search`,
    },
  };
}

export default async function ResultPage({ searchParams }: ResultsPageProps) {
  const params = await searchParams;
  const query = params?.query?.trim() || "";

  return (
    <Container>
      <SearchResult query={query} />
    </Container>
  );
}