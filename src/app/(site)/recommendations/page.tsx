// app/recommendations/page.tsx
// Drop this into your Next.js App Router pages directory

import type { Metadata } from 'next'
import { Recommendation } from "@/components/recommend/Recommendation";
import Container from '@/components/common/Container';
// ─── Static metadata ──────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Community Recommendations | CineVault',
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
  authors: [{ name: 'CineVault Community' }],
  openGraph: {
    title: 'Community Movie & TV Recommendations | CineVault',
    description:
      'Discover movies and TV shows recommended by the community. Vote on your favourites and add your own picks.',
    type: 'website',
    url: 'https://yourdomain.com/recommendations',
    siteName: 'CineVault',
    images: [
      {
        url: '/og-recommendations.jpg', // 1200×630 recommended
        width: 1200,
        height: 630,
        alt: 'CineVault Community Recommendations',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Community Movie & TV Recommendations | CineVault',
    description:
      'Browse and vote on community-curated movie and TV show recommendations.',
    images: ['/og-recommendations.jpg'],
    creator: '@cinevault', // update to your handle
  },
  alternates: {
    canonical: 'https://yourdomain.com/recommendations',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
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