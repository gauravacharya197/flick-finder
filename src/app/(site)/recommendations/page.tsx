// app/recommendations/page.tsx
// Drop this into your Next.js App Router pages directory

import type { Metadata } from 'next'
import { Recommendation } from "@/components/recommend/Recommendation";
import Container from '@/components/common/Container';
// ─── Static metadata ──────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Community Recommendations | Flickday',
  description:
    'Browse and vote on community-curated movie and TV show recommendations. Discover hidden gems and popular picks chosen by real viewers.',
  keywords: [
    'movie recommendations',
    'TV show recommendations',
    'community picks',
    'best movies to watch',
    'best TV shows',
    'movie voting',
    'film suggestions',
  ],
  
  
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
     
    },
  },
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RecommendationsPage() {
  return (
       <Container>

      {/*
        RecommendationsJsonLd is rendered inside <Recommendation>
        after data loads so it has real items to list.
      */}
      <Recommendation />
        </Container>

  )
}