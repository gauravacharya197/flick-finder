
import { siteConfig } from "@/config/siteConfig";
import SearchResult from "@/components/Result/SearchResult";
import React from "react";
import { Metadata } from "next";

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
    <div className="min-h-screen dark:text-white">
      <div className="container mx-auto px-4 lg:px-8 py-6 md:py-10">
        <SearchResult query={searchParams.query} />
      </div>
    </div>
  );
};

export default ResultsPage;
