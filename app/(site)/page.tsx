import { Metadata } from "next";
import Home from "@/components/Home";
import useMetadata from "@/hooks/useMetaData";
import { siteConfig } from "@/config/siteConfig";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  // other metadata
};

export default function HomePage() {
 
  return (
    <main>
      <Home />
     

      {/* <Feature /> */}
      {/* <FeaturesTab />
      <FunFact /> */}
      {/* <FAQ /> */}
    </main>
  );
}
