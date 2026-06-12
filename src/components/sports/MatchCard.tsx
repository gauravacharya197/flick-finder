"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import type { Match } from "@/types/sports";

const IMAGE_BASE = "https://streamed.pk";

function formatDate(ts: number) {
  const d = new Date(ts);
  return (
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }) +
    " · " +
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" })
  );
}

function TeamAvatar({ name }: { name: string }) {
  // Show up to 2 initials from the team name
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
      <div className="w-12 h-12 rounded-full bg-black/50 border border-strokedark flex items-center justify-center shrink-0">
        <span className="text-primary font-bold text-metatitle2 leading-none">
          {initials}
        </span>
      </div>
      <span className="text-white text-metatitle font-medium text-center leading-tight w-full px-1 line-clamp-2">
        {name}
      </span>
    </div>
  );
}

export function MatchCard({
  match,
  onClick,
}: {
  match: Match;
  onClick: () => void;
}) {
  if (!match?.teams?.home || !match?.teams?.away) return null;

  const posterUrl = match.poster ? `${IMAGE_BASE}${match.poster}` : null;
  const [live, setLive] = useState<boolean | null>(null);

  useEffect(() => {
    const now = Date.now();
    setLive(now >= match.date && now <= match.date + 7_200_000);
  }, [match.date]);

  return (
    <button
      onClick={onClick}
      className="group text-left w-full bg-blacksection border border-strokedark rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-solid-5 cursor-pointer"
    >
      {/* Poster */}
      {posterUrl && (
        <div className="relative h-32 overflow-hidden">
          <Image
            src={posterUrl}
            alt={match.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blacksection via-blacksection/50 to-transparent" />

          {/* Category */}
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-primary/20 border border-primary/30 text-primary text-metatitle rounded-full capitalize">
            {match.category}
          </span>

          {/* Live / date badge */}
          {live === null ? null : live ? (
            <span className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 bg-red-500/90 text-white text-metatitle rounded-full font-semibold">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              LIVE
            </span>
          ) : (
            <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-black/60 text-manatee text-metatitle rounded-full">
              {formatDate(match.date)}
            </span>
          )}
        </div>
      )}

      {/* Teams */}
      <div className="p-4">
        <div className="flex items-center gap-2">
          <TeamAvatar name={match.teams.home.name} />
          <span className="text-waterloo text-metatitle font-semibold shrink-0">VS</span>
          <TeamAvatar name={match.teams.away.name} />
        </div>

        {/* Stream count only — no watch button */}
        <p className="text-waterloo text-metatitle mt-3 pt-3 border-t border-strokedark">
          {match.sources.length} stream{match.sources.length !== 1 ? "s" : ""} available
        </p>
      </div>
    </button>
  );
}