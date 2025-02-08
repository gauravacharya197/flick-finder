"use client";
import React from "react";
import SectionHeader from "../Common/SectionHeader";
import { MediaType } from "@/types/mediaType";
import { MoviesSection } from "../Common/MediaSection";

interface ExploreProps {
  mediaType: MediaType;
}

export const Explore: React.FC<ExploreProps> = ({ mediaType }) => {
  return (
    <>
      <SectionHeader
        className="pb-4 pt-2"
        text={mediaType=="tv"? "TV Shows" : "Movies" }
      />

    </>
  );
};
