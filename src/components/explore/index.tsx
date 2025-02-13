"use client";
import React from "react";
import SectionHeader from "../common/SectionHeader";
import { MediaType } from "@/types/mediaType";

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
