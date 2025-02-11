import { Metadata } from "next";
import Home from "@/components/Home";
import { siteConfig } from "@/config/siteConfig";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  // other metadata
};

export default function AdminPage() {
 
  return (
    <>
    "ADMIN PAGEE"

    </>
  );
}
