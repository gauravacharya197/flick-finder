import Container from "@/components/common/Container";
import { Genre } from "@/components/genre/Genre";
import { siteConfig } from "@/config/siteConfig";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { Metadata } from "next";
import React from "react";

type GenrePageProps = { params: Promise<{ genre: string }> };

export  async function generateMetadata({params}:   GenrePageProps) {
  const genre = (await params).genre;
  const formattedGenre = decodeURIComponent(genre).replace(/-/g, ' ');


  return {
    title: `${capitalizeFirstLetter(formattedGenre)} - Best Popular ${formattedGenre} Movies/TV Series`,
    description: `Browse ${formattedGenre} movies and TV series on ${siteConfig.siteName}. ${siteConfig.description}`,
  };
}

export default async function GenrePage({params}:   GenrePageProps) {
  const genre = (await params).genre;

  const formattedGenre = decodeURIComponent(genre).replace(/-/g, " ");
  return (
    <Container>
      <Genre value={formattedGenre} />{" "}
    </Container>
  );
}
