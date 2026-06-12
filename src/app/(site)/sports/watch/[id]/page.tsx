// app/sports/watch/[id]/page.tsx
import type { Metadata } from "next";
import Container from "@/components/common/Container";
import { WatchSports } from "@/components/sports/WatchSports";

const BASE = "https://streamed.pk/api";
const SITE_URL = "https://flickday.to";
const SITE_NAME = "Flickday";

interface Match {
  id: string;
  title: string;
  category: string;
  date: number;
  poster: string;
  teams: {
    home: { name: string; badge: string };
    away: { name: string; badge: string };
  };
  sources: { source: string; id: string }[];
}

async function getMatch(id: string): Promise<Match | null> {
  try {
    const res = await fetch(`${BASE}/matches/all/popular`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return null;
    const matches: Match[] = await res.json();
    return matches.find((m) => m.id === id) ?? null;
  } catch {
    return null;
  }
}

function slugToTitle(id: string) {
  return id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const match = await getMatch(id);

  const title = match?.title ?? slugToTitle(id);
  const home = match?.teams?.home?.name ?? "";
  const away = match?.teams?.away?.name ?? "";
  const category = match?.category ?? "Sports";
  const posterUrl = match?.poster ? `https://streamed.pk${match.poster}` : null;

  const pageTitle = `Watch ${title} Live Stream | ${SITE_NAME}`;
  const description = home && away
    ? `Watch ${home} vs ${away} live stream online. Free HD ${category} streaming on ${SITE_NAME}. Multiple streams available.`
    : `Watch ${title} live stream free in HD on ${SITE_NAME}. Multiple sources available.`;

  return {
    title: pageTitle,
    description,
    keywords: [
      `${title} live stream`,
      `${title} watch online`,
      ...(home && away ? [`${home} vs ${away}`, `${home} vs ${away} live`] : []),
      `${category} live stream`,
      `free ${category} streaming`,
      `watch ${category} online`,
      `${SITE_NAME} sports`,
    ],
    openGraph: {
      title: pageTitle,
      description,
      url: `${SITE_URL}/sports/watch/${id}`,
      siteName: SITE_NAME,
      type: "website",
      ...(posterUrl && {
        images: [{ url: posterUrl, width: 1280, height: 720, alt: title }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      ...(posterUrl && { images: [posterUrl] }),
    },
    alternates: {
      canonical: `${SITE_URL}/sports/watch/${id}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default async function WatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const match = await getMatch(id);

  // JSON-LD structured data for the match
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: match?.title ?? slugToTitle(id),
    sport: match?.category ?? "Sports",
    ...(match?.date && {
      startDate: new Date(match.date).toISOString(),
    }),
    ...(match?.teams?.home && match?.teams?.away && {
      homeTeam: { "@type": "SportsTeam", name: match.teams.home.name },
      awayTeam: { "@type": "SportsTeam", name: match.teams.away.name },
    }),
    url: `${SITE_URL}/sports/watch/${id}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container>
        <WatchSports id={id} />
      </Container>
    </>
  );
}