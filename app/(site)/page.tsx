import { Metadata } from "next";
import Hero from "@/components/Hero";
import Brands from "@/components/Brands";
import Feature from "@/components/Features";
import About from "@/components/About";
import FeaturesTab from "@/components/FeaturesTab";
import FunFact from "@/components/FunFact";
import Integration from "@/components/Integration";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Blog from "@/components/Blog";
import Testimonial from "@/components/Testimonial";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "FlickFinder - Pick movie of based on your emotion",
  description: "Home of your favorite Movies",
  // other metadata
};

export default function Home() {
  return (
    <main>
      <Hero />
      <Brands />
      {/* <Feature /> */}
      <FeaturesTab />
      <FunFact />
      <FAQ />
     
     
     
    </main>
  );
}
