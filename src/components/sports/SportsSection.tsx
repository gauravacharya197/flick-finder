"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import type { Sport, Match } from "@/types/sports";
import { MatchCard } from "@/components/sports/MatchCard";

const BASE = "https://streamed.pk/api";

const fetchSports = (): Promise<Sport[]> =>
  fetch(`${BASE}/sports`).then((r) => {
    if (!r.ok) throw new Error("Failed to fetch sports");
    return r.json();
  });

const fetchMatches = (category: string): Promise<Match[]> =>
  fetch(
    category === "all"
      ? `${BASE}/matches/all/popular`
      : `${BASE}/matches/${category}/popular`
  ).then((r) => {
    if (!r.ok) throw new Error("Failed to fetch matches");
    return r.json();
  });

function SkeletonCard() {
  return (
    <div className="bg-blacksection border border-strokedark rounded-xl overflow-hidden animate-pulse">
      <div className="h-32 bg-strokedark/30" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <div className="w-11 h-11 rounded-full bg-strokedark/40" />
          <div className="w-6 h-3 bg-strokedark/30 rounded" />
          <div className="w-11 h-11 rounded-full bg-strokedark/40" />
        </div>
        <div className="h-2.5 bg-strokedark/30 rounded w-2/3 mt-1" />
      </div>
    </div>
  );
}

export function SportsSection() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");

  const { data: sports = [], isLoading: loadingSports } = useQuery<Sport[]>({
    queryKey: ["sports"],
    queryFn: fetchSports,
    staleTime: 1000 * 60 * 10,
  });

  const {
    data: matches = [],
    isLoading: loadingMatches,
    isError,
  } = useQuery<Match[]>({
    queryKey: ["matches", activeCategory],
    queryFn: () => fetchMatches(activeCategory),
    staleTime: 1000 * 60 * 2,
  });

  const tabs: Sport[] = [{ id: "all", name: "All" }, ...sports];

  function handleMatchClick(match: Match) {
    router.push(`/sports/watch/${match.id}`);
  }

  return (
    <section className="py-5 lg:py-5">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-primary text-sectiontitle font-medium tracking-wide uppercase">
            Live &amp; Upcoming
          </span>
        </div>
        <h1 className="text-sectiontitle3 font-bold text-white leading-tight">
          Popular{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-500">
            Sports Streams
          </span>
        </h1>
        <p className="text-waterloo text-regular mt-3 max-w-xl">
          Browse popular matches across all sports. Click a category to filter.
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        {loadingSports
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-9 w-20 rounded-full bg-blacksection border border-strokedark animate-pulse"
              />
            ))
          : tabs.map((sport) => {
              const active = sport.id === activeCategory;
              return (
                <button
                  key={sport.id}
                  onClick={() => setActiveCategory(sport.id)}
                  className={`px-4 py-2 rounded-full text-sectiontitle font-medium transition-all duration-200 border ${
                    active
                      ? "bg-primary text-black border-primary shadow-solid-5"
                      : "bg-blacksection text-manatee border-strokedark hover:border-primary hover:text-primary"
                  }`}
                >
                  {sport.name}
                </button>
              );
            })}
      </div>

      {/* Matches grid */}
      {isError ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-waterloo text-regular mb-1">
            Couldn&apos;t load matches right now.
          </p>
          <p className="text-manatee text-sectiontitle">
            Try another category or check back soon.
          </p>
        </div>
      ) : loadingMatches ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-waterloo text-regular">
            No popular matches in this category right now.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {matches
            .filter((m) => m?.teams?.home && m?.teams?.away)
            .map((match, index) => (
              <MatchCard
                key={`${match.id}-${index}`}
                match={match}
                onClick={() => handleMatchClick(match)}
              />
            ))}
        </div>
      )}

      {!loadingMatches && matches.length > 0 && (
        <p className="text-waterloo text-sectiontitle mt-6 text-center">
          {matches.length} popular match{matches.length !== 1 ? "es" : ""}
        </p>
      )}
    </section>
  );
}