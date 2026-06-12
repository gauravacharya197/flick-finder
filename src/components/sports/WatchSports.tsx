"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const BASE = "https://streamed.pk/api";
const IMAGE_BASE = "https://streamed.pk";

interface Stream {
  id: string;
  streamNo: number;
  language: string;
  hd: boolean;
  embedUrl: string;
  source: string;
}

interface Match {
  id: string;
  title: string;
  category: string;
  date: number;
  popular?: boolean;
  poster?: string;
  teams?: {
    home: { name: string; badge: string };
    away: { name: string; badge: string };
  };
  sources: { source: string; id: string }[];
}

const fetchAllMatches = (): Promise<Match[]> =>
  fetch(`${BASE}/matches/all`).then((r) => {
    if (!r.ok) throw new Error("Failed");
    return r.json();
  });

const fetchStreams = (source: string, sourceId: string): Promise<Stream[]> =>
  fetch(`${BASE}/stream/${source}/${sourceId}`).then((r) => {
    if (!r.ok) throw new Error("Failed");
    return r.json();
  });

function Initials({ name }: { name: string }) {
  const letters = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-teal-500/15 border border-teal-500/30 flex items-center justify-center shrink-0">
      <span className="text-teal-400 font-bold text-xs leading-none">{letters}</span>
    </div>
  );
}

function WifiOffIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="2" y1="2" x2="22" y2="22" />
      <path d="M8.5 16.5a5 5 0 0 1 7 0" />
      <path d="M2 8.82a15 15 0 0 1 4.17-2.65" />
      <path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76" />
      <path d="M16.85 11.25a10 10 0 0 1 2.22 1.68" />
      <path d="M5 12.9a10 10 0 0 1 5.26-2.68" />
      <circle cx="12" cy="20" r="1" fill="#f87171" stroke="none" />
    </svg>
  );
}

export function WatchSports({ id }: { id: string }) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const { data: allMatches = [] } = useQuery<Match[]>({
    queryKey: ["matches", "all"],
    queryFn: fetchAllMatches,
    staleTime: 1000 * 60 * 5,
  });

  const currentMatch = allMatches.find((m) => m.id === id);

  const firstSource = currentMatch?.sources?.[0];
  const streamSource = firstSource?.source ?? "admin";
  const streamSourceId = firstSource?.id ?? id;

  const {
    data: streams = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<Stream[]>({
    queryKey: ["streams", streamSource, streamSourceId],
    queryFn: () => fetchStreams(streamSource, streamSourceId),
    enabled: !!currentMatch,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const current = streams[activeIndex];
  const related = allMatches.filter((m) => m.id !== id).slice(0, 14);

  const matchTitle = currentMatch?.title ?? id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const formattedDate = currentMatch
    ? new Date(currentMatch.date).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen py-6 lg:py-10">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* ── Main column ── */}
        <div className="flex-1 min-w-0">

          {/* "You're Watching" bar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-[#94a3b8] text-sm">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>You&apos;re Watching</span>
              {currentMatch && (
                <span className="text-white font-semibold ml-1">{matchTitle}</span>
              )}
            </div>
            <button
              onClick={() => router.push("/sports")}
              className="text-[#94a3b8] hover:text-teal-400 text-sm transition-colors"
            >
              ← Back
            </button>
          </div>

          {/* Player */}
          <div className="relative w-full aspect-video bg-[#0d1117] rounded-2xl overflow-hidden border border-[#1e2a3a]">
            {isLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 rounded-full border-2 border-[#1e2a3a] border-t-teal-400 animate-spin" />
                <span className="text-[#64748b] text-sm">Loading stream…</span>
              </div>
            ) : isError || !current ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-8">
                <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <WifiOffIcon />
                </div>
                <div>
                  <p className="text-white text-base font-semibold">Stream unavailable</p>
                  <p className="text-[#64748b] text-sm mt-1.5 max-w-xs leading-relaxed">
                    This stream couldn&apos;t be loaded. Try switching to another one below.
                  </p>
                </div>
                <button
                  onClick={() => refetch()}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg border border-red-500/30 bg-red-500/[0.08] text-red-400 text-sm hover:bg-red-500/[0.15] hover:border-red-500/50 transition-all"
                >
                  ↺ Retry
                </button>
              </div>
            ) : (
              <iframe
                key={current.embedUrl}
                src={current.embedUrl}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                allow="autoplay; encrypted-media; picture-in-picture"
                title={matchTitle}
              />
            )}
          </div>

          {/* Server / stream selector */}
          <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {streams.map((stream, i) => {
                const isFailed = isError && i === activeIndex;
                return (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-150 ${
                      isFailed
                        ? "bg-red-500/[0.08] text-red-400 border-red-500/30"
                        : i === activeIndex
                        ? "bg-teal-500 text-[#0d1117] border-teal-500 font-semibold"
                        : "bg-[#131c2e] text-[#94a3b8] border-[#1e2a3a] hover:border-teal-500/50 hover:text-teal-400"
                    }`}
                  >
                    {isFailed && <span className="text-sm">⚠</span>}
                    {stream.hd && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        isFailed ? "bg-red-500/15 text-red-400"
                        : i === activeIndex ? "bg-black/25 text-[#0d1117]"
                        : "bg-teal-500/20 text-teal-400"
                      }`}>HD</span>
                    )}
                    Stream {stream.streamNo}
                    <span className={`text-xs ${i === activeIndex && !isFailed ? "opacity-60" : "opacity-50"}`}>
                      {stream.language.split(" - ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hint */}
          <p className="text-[#3d5068] text-sm mt-2">
            {isError
              ? `Stream ${streams[activeIndex]?.streamNo ?? activeIndex + 1} failed — try a different one above.`
              : "If the current server doesn't work, try switching to a different one."}
          </p>

          {/* ── Match info section (Flickday style) ── */}
          {currentMatch && (
            <div className="mt-8 flex flex-col sm:flex-row gap-6">

              {/* Poster */}
              <div className="shrink-0">
                {currentMatch.poster ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`${IMAGE_BASE}${currentMatch.poster}`}
                    alt={matchTitle}
                    className="w-36 sm:w-44 rounded-xl object-cover border border-[#1e2a3a]"
                  />
                ) : (
                  <div className="w-36 sm:w-44 aspect-[2/3] rounded-xl bg-[#131c2e] border border-[#1e2a3a] flex items-center justify-center">
                    <span className="text-teal-400 font-bold text-2xl">
                      {matchTitle.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-white text-2xl sm:text-3xl font-bold leading-tight">{matchTitle}</h1>

                {/* Teams */}
                {currentMatch.teams?.home && (
                  <div className="flex items-center gap-3 mt-3">
                    <Initials name={currentMatch.teams.home.name} />
                    <span className="text-white font-medium">{currentMatch.teams.home.name}</span>
                    <span className="text-[#3d5068] font-bold text-sm">vs</span>
                    <Initials name={currentMatch.teams.away!.name} />
                    <span className="text-white font-medium">{currentMatch.teams.away!.name}</span>
                  </div>
                )}

                {/* Meta row */}
                <div className="flex items-center gap-3 mt-4 flex-wrap">
                  <span className="px-3 py-1 bg-teal-500 text-[#0d1117] text-sm font-semibold rounded-md capitalize">
                    {currentMatch.category}
                  </span>
                  {formattedDate && (
                    <span className="flex items-center gap-1.5 text-[#64748b] text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {formattedDate}
                    </span>
                  )}
                  <span className="text-[#64748b] text-sm">
                    {currentMatch.sources.length} source{currentMatch.sources.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Sources list as genre-style tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {currentMatch.sources.map((src, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-[#131c2e] border border-[#1e2a3a] text-[#94a3b8] text-sm rounded-lg capitalize"
                    >
                      {src.source}
                    </span>
                  ))}
                </div>

                {/* Streams active info */}
                {streams.length > 0 && current && (
                  <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3 text-sm max-w-sm">
                    <div>
                      <p className="text-[#3d5068] text-xs uppercase tracking-wide mb-1">Language</p>
                      <p className="text-white">{current.language}</p>
                    </div>
                    <div>
                      <p className="text-[#3d5068] text-xs uppercase tracking-wide mb-1">Quality</p>
                      <p className="text-white">{current.hd ? "HD" : "SD"}</p>
                    </div>
                   
                    
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="w-full lg:w-72 xl:w-80 shrink-0">
          <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
            <span className="w-1 h-6 bg-teal-400 rounded-sm inline-block" />
            You might like
          </h2>

          <div className="flex flex-col gap-3">
            {related.map((match, i) => {
              const poster = match.poster ? `${IMAGE_BASE}${match.poster}` : null;
              const label = match.teams
                ? `${match.teams.home.name} vs ${match.teams.away.name}`
                : match.title;
              const thumbLetters = match.teams
                ? match.teams.home.name.slice(0, 2).toUpperCase()
                : match.title.slice(0, 2).toUpperCase();
              const dateStr = new Date(match.date).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              });
              return (
                <button
                  key={`${match.id}-${i}`}
                  onClick={() => router.push(`/sports/watch/${match.id}`)}
                  className="group flex items-center gap-3 p-3 rounded-xl border border-[#1e2a3a] bg-[#0d1421] hover:border-teal-500/40 hover:bg-[#111d30] transition-all duration-150 text-left w-full"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#1e2a3a] shrink-0 bg-[#131c2e] flex items-center justify-center">
                    {poster ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={poster} alt={match.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-teal-400 font-bold text-sm">{thumbLetters}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium leading-snug truncate group-hover:text-teal-400 transition-colors">
                      {label}
                    </p>
                    <p className="flex items-center gap-1 text-[#64748b] text-xs mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {dateStr}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="px-2 py-0.5 bg-teal-500 text-[#0d1117] text-[10px] font-bold rounded capitalize">
                        {match.category}
                      </span>
                      <span className="text-[#3d5068] text-[11px]">
                        {match.sources.length} stream{match.sources.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}