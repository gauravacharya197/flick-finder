import { Metadata } from "next";
import Home from "@/components/Home";
import useMetadata from "@/hooks/useMetaData";

export const metadata: Metadata = {
  title: "FlickFinder - Pick movie of based on your emotion",
  description: "Home of your favorite Movies",
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
