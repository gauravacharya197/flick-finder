import React from "react";
import { FaHome, FaRocket } from "react-icons/fa";
import Link from "next/link";
import { Metadata } from "next";
import { siteConfig } from "@/config/siteConfig";
import { PageNotFound } from "@/components/common/PageNotFound";
import Container from "@/components/common/Container";
import Manga from "@/components/manga";
export const metadata: Metadata = {
  title:  `Browse Manga - ${siteConfig.title}`,
  description: siteConfig.description,
  // other metadata
};
export default function MangaPage() {
  return (
    <Container><Manga/></Container>
  );
};

