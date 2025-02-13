import { Metadata } from "next";
import { siteConfig } from "@/config/siteConfig";
import MovieHomepage from "./home/page";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  // other metadata
};

export default function HomePage() {
 
  return (
    <>
      <div><MovieHomepage/></div>

    </>
  );
}
