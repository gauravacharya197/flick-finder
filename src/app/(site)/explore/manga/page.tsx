import React, { Suspense } from "react";
import { FaHome, FaRocket } from "react-icons/fa";
import Link from "next/link";
import { Metadata } from "next";
import { siteConfig } from "@/config/siteConfig";
import { PageNotFound } from "@/components/common/PageNotFound";
import Container from "@/components/common/Container";
import Manga from "@/components/manga";

export const metadata: Metadata = {
  title: `Browse Manga - Read Free Manga Online | ${siteConfig.title}`,
  description: `Explore our collection of manga. Read the latest manga chapters and series for free. ${siteConfig.description}`,
  keywords: "manga, read manga, free manga, manga online, manga collection, manga series",
  openGraph: {
    title: `Browse Manga - Read Free Manga Online | ${siteConfig.title}`,
    description: `Explore our collection of manga. Read the latest chapters and series for free.`,
    type: "website",
    url: `${siteConfig.url}/explore/manga`,
  },
  alternates: {
    canonical: `${siteConfig.url}explore/manga`,
  }
};

export default function MangaPage() {
  return (
    <Container>
      <h1 className="sr-only">Browse Manga - Read Free Manga Online</h1>
      <Suspense><Manga /></Suspense>
    </Container>
  );
}