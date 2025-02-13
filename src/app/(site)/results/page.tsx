
import { siteConfig } from "@/config/siteConfig";
import SearchResult from "@/components/search/SearchResult";
import React from "react";
import { Metadata } from "next";
import Container from "@/components/common/Container";
interface ResultsPageProps {
  searchParams: { query?: string };
}
export async function generateMetadata(
  { searchParams }: ResultsPageProps
): Promise<Metadata> {
  const {query} = await searchParams;
  // Decode and format the title if available, otherwise use a default
  return {
    title: query
      ? `${siteConfig.siteName} - Results for "${query}"`
      : `${siteConfig.siteName} - Search Movies & TV Shows`,
    description: `Explore movies and TV series related to "${query}" on ${siteConfig.siteName}. ${siteConfig.description}`,
  };
}


export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const { query } = await searchParams;
  // Use `query` as needed
  await new Promise(resolve => setTimeout(resolve, 4000));
  return (
    <Container>
        <SearchResult query={query} />
    </Container>
  );
}
