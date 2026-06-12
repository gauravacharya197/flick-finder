// app/sports/page.tsx
import type { Metadata } from "next";
import Container from "@/components/common/Container";
import { SportsSection } from "@/components/sports/SportsSection";

export const metadata: Metadata = {
  title: "Live Sports Streams | Flickday",
  description:
    "Watch popular live and upcoming sports matches. Browse football, basketball, and more.",
  robots: { index: true, follow: true },
};

export default function SportsPage() {
  return (
    <Container>
      <SportsSection />
    </Container>
  );
}