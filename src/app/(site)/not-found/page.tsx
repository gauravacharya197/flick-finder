import React from "react";
import { FaHome, FaRocket } from "react-icons/fa";
import Link from "next/link";
import { Metadata } from "next";
import { siteConfig } from "@/config/siteConfig";
import { PageNotFound } from "@/components/common/PageNotFound";
export const metadata: Metadata = {
  title:  `404 - ${siteConfig.title}`,
  description: siteConfig.description,
  // other metadata
};
export default function NotFound() {
  return (
    <PageNotFound/>
  );
};

