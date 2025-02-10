
import { siteConfig } from "@/config/siteConfig";
import SearchResult from "@/components/Result/SearchResult";
import React from "react";
import { Metadata } from "next";
import Container from "@/components/Common/Container";

interface ResultsPageProps {
  searchParams: { query?: string };
}
export async function generateMetadata(
  { searchParams }: ResultsPageProps
): Promise<Metadata> {


  return {
    title: searchParams.query
      ? `${siteConfig.siteName} - Results for "${searchParams.query}"`
      : `${siteConfig.siteName} - Search Movies & TV Shows`,
    description: `Explore movies and TV series related to "${searchParams.query}" on ${siteConfig.siteName}. ${siteConfig.description}`,
  };
  
}
const ResultsPage = ({ searchParams }: ResultsPageProps) => {
 

  return (
    <Container>
        <SearchResult query={searchParams.query} />
    </Container>
  );
};

export default ResultsPage;
