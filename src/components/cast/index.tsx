'use client'
import React, { useState } from "react";
import { FaCalendar, FaMap, FaStar, FaImdb, FaFilm, FaTv, FaTrophy, FaChevronDown } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getCastWithCredits } from "@/services/MovieService";
import { MovieList } from "../movie/MovieList";
import Skeleton from "../common/Skeleton";
import useMetadata from "@/hooks/useMetaData";
import { siteConfig } from "@/config/siteConfig";

interface CastProps {
  castId: string;
}

type Tab = "overview" | "filmography" | "tv";

export const Cast: React.FC<CastProps> = ({ castId }) => {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [bioExpanded, setBioExpanded] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);

  const { data: castInfo, isLoading, error } = useQuery({
    queryKey: ['cast', castId],
    queryFn: () => getCastWithCredits(castId),
  });

  const metadata = {
    title: castInfo?.data
      ? `${castInfo.data.name} - Actor Profile and Filmography | ${siteConfig.siteName}`
      : `Cast Profile | ${siteConfig.siteName}`,
    description: castInfo?.data
      ? `Explore ${castInfo.data.name}'s complete filmography, biography, and career highlights. Known for ${castInfo.data.combinedCredits?.cast?.slice(0, 2).map((c: any) => c.displayTitle).join(', ')}. ${castInfo.data.knownForDepartment} since ${new Date(castInfo.data.birthday).getFullYear()}.`.slice(0, 160)
      : 'Find detailed actor profiles, complete filmographies, and career information.',
    openGraph: {
      title: castInfo?.data?.name,
      description: castInfo?.data?.biography?.slice(0, 160),
      images: castInfo?.data?.profilePath
        ? [`https://image.tmdb.org/t/p/w500${castInfo.data.profilePath}`]
        : [],
    },
  };

  useMetadata(metadata.title, metadata.description, metadata.openGraph);

  if (isLoading) {
    return (
      <div className="space-y-4 pt-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} showTitle={false} rows={5} rowHeight="h-9" className="w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-light tracking-wider text-red-400">
          Error loading cast details
        </div>
      </div>
    );
  }

  const cast = castInfo?.data;
  const allCredits = cast?.combinedCredits?.cast ?? [];
  const movies = allCredits.filter((c: any) => c.mediaType === 'movie' || !c.mediaType);
  const tvShows = allCredits.filter((c: any) => c.mediaType === 'tv');
  const topCredits = [...allCredits]
    .sort((a: any, b: any) => (b.voteCount ?? 0) - (a.voteCount ?? 0))
    .slice(0, 3);

  const birthYear = cast?.birthday ? new Date(cast.birthday).getFullYear() : null;
  const currentYear = new Date().getFullYear();
  const yearsActive = birthYear ? currentYear - birthYear : null;
  const totalCredits = allCredits.length;

  return (
    <div className="min-h-screen text-white font-inter">

      {/* ── HERO: blurred bg + portrait card ── */}
      <div className="relative overflow-hidden">
        {/* Blurred bg — same portrait image, heavily blurred + darkened */}
        {cast?.profilePath && (
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/w780${cast.profilePath})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              filter: 'blur(32px) brightness(0.25) saturate(1.3)',
              transform: 'scale(1.12)',
            }}
          />
        )}
        {/* Dark tint overlay */}
        <div className="absolute inset-0 z-0 bg-background/50" />
        {/* Bottom fade into page bg */}
        <div className="absolute bottom-0 left-0 right-0 h-28 z-10 bg-gradient-to-t from-background to-transparent" />

        {/* Content row */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-14 flex flex-col md:flex-row items-center md:items-end gap-8 md:gap-12">

          {/* Portrait image */}
          <div
            className="shrink-0"
            style={{
              opacity: heroLoaded ? 1 : 0,
              transform: heroLoaded ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.97)',
              transition: 'all 0.7s ease',
            }}
          >
            {cast?.profilePath ? (
              <img
                src={`https://image.tmdb.org/t/p/w342${cast.profilePath}`}
                alt={cast?.name}
                onLoad={() => setHeroLoaded(true)}
                className="w-36 md:w-48 rounded-2xl shadow-2xl border-2 border-strokedark"
                style={{ aspectRatio: '2/3', objectFit: 'cover' }}
              />
            ) : (
              <div
                className="w-36 md:w-48 rounded-2xl bg-blacksection border-2 border-strokedark flex items-center justify-center"
                style={{ aspectRatio: '2/3' }}
              >
                <FaStar className="w-10 h-10 text-waterloo" />
              </div>
            )}
          </div>

          {/* Name + meta */}
          <div
            className="flex-1 pb-2"
            style={{
              opacity: heroLoaded ? 1 : 0,
              transform: heroLoaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.9s ease 0.15s',
            }}
          >
            {cast?.knownForDepartment && (
              <span className="inline-flex items-center gap-1.5 text-xs tracking-[0.2em] uppercase text-primary font-medium mb-3">
                <FaStar className="w-3 h-3" />
                {cast.knownForDepartment}
              </span>
            )}
            <h1
              className="text-4xl md:text-6xl font-bold mb-5 leading-none tracking-tight text-white"
              style={{ textShadow: '0 4px 32px rgba(0,0,0,0.6)' }}
            >
              {cast?.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-manatee">
              {cast?.birthday && (
                <span className="flex items-center gap-2">
                  <FaCalendar className="text-primary w-3.5 h-3.5" />
                  {new Date(cast.birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              )}
              {cast?.placeOfBirth && (
                <span className="flex items-center gap-2">
                  <FaMap className="text-primary w-3.5 h-3.5" />
                  {cast.placeOfBirth}
                </span>
              )}
              {cast?.imdbId && (
                <a
                  href={`https://www.imdb.com/name/${cast.imdbId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-primary text-black px-3 py-1.5 rounded text-xs font-bold tracking-wide hover:bg-primary-400 transition-colors duration-200"
                >
                  <FaImdb className="w-4 h-4" />
                  IMDb
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── STAT STRIP ── */}
      <div className="bg-blacksection border-y border-strokedark">
        <div className="max-w-6xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: "Total Credits", value: totalCredits,      icon: <FaFilm />   },
            { label: "Movies",        value: movies.length,     icon: <FaFilm />   },
            { label: "TV Shows",      value: tvShows.length,    icon: <FaTv />     },
            { label: "Career (yrs)", value: yearsActive ?? "—", icon: <FaTrophy /> },
          ].map(({ label, value, icon }) => (
            <div key={label} className="space-y-1">
              <div className="text-primary flex justify-center text-lg">{icon}</div>
              <div className="text-3xl font-bold tracking-tight text-white">{value}</div>
              <div className="text-metatitle uppercase tracking-widest text-waterloo">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Known For spotlight */}
        {topCredits.length > 0 && (
          <div className="mb-14">
            <p className="text-metatitle tracking-[0.25em] uppercase text-primary font-medium mb-5">
              ✦ Known For
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {topCredits.map((credit: any, i: number) => (
                <div
                  key={credit.id ?? i}
                  className="group relative rounded-xl overflow-hidden cursor-pointer border border-strokedark hover:border-primary transition-colors duration-300"
                  style={{
                    opacity: 0,
                    animation: `fadeSlideUp 0.5s ease forwards`,
                    animationDelay: `${i * 0.12}s`,
                  }}
                >
                  <div className="relative aspect-[2/3] bg-blacksection">
                    {(credit.posterPath || credit.backdropPath) && (
                      <img
                        src={`https://image.tmdb.org/t/p/w342${credit.posterPath ?? credit.backdropPath}`}
                        alt={credit.displayTitle ?? credit.title ?? credit.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-primary text-black text-xs font-bold flex items-center justify-center">
                      {i + 1}
                    </div>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-4">
                    <p className="font-semibold text-sm leading-tight text-white">
                      {credit.displayTitle ?? credit.title ?? credit.name}
                    </p>
                    {credit.character && (
                      <p className="text-metatitle text-primary mt-0.5">as {credit.character}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8 border-b border-strokedark">
          <div className="flex gap-0">
            {(["overview", "filmography", "tv"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative px-6 py-3.5 text-sectiontitle font-medium capitalize tracking-wide transition-colors duration-200"
                style={{ color: activeTab === tab ? '#14b8a6' : '#999AA1' }}
              >
                {tab === "tv" ? "TV Shows" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    style={{ animation: 'expandWidth 0.25s ease' }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Overview tab */}
        {activeTab === "overview" && (
          <div className="space-y-8" style={{ animation: 'fadeIn 0.3s ease' }}>

            {cast?.biography && (
              <div>
                <p className="text-metatitle tracking-[0.25em] uppercase text-primary font-medium mb-4">
                  ✦ Biography
                </p>
                <div className="relative">
                  <p
                    className="text-manatee leading-relaxed text-regular"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: bioExpanded ? 'unset' : 6,
                      WebkitBoxOrient: 'vertical',
                      overflow: bioExpanded ? 'visible' : 'hidden',
                    }}
                  >
                    {cast.biography}
                  </p>
                  {!bioExpanded && cast.biography.length > 400 && (
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
                  )}
                </div>
                {cast.biography.length > 400 && (
                  <button
                    onClick={() => setBioExpanded(!bioExpanded)}
                    className="mt-3 flex items-center gap-2 text-sectiontitle text-primary hover:text-primary-400 transition-colors duration-200 font-medium"
                  >
                    {bioExpanded ? 'Show less' : 'Read full biography'}
                    <FaChevronDown
                      className="w-3 h-3 transition-transform duration-300"
                      style={{ transform: bioExpanded ? 'rotate(180deg)' : 'none' }}
                    />
                  </button>
                )}
              </div>
            )}

            <div>
              <p className="text-metatitle tracking-[0.25em] uppercase text-primary font-medium mb-4">
                ✦ Personal Details
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "Born",          value: cast?.birthday ? new Date(cast.birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null },
                  { label: "Birthplace",    value: cast?.placeOfBirth },
                  { label: "Known For",     value: cast?.knownForDepartment },
                  { label: "Total Credits", value: totalCredits ? `${totalCredits} titles` : null },
                ].filter(({ value }) => value).map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex justify-between items-center py-3 px-4 rounded-lg bg-blacksection border border-strokedark"
                  >
                    <span className="text-metatitle uppercase tracking-widest text-waterloo">{label}</span>
                    <span className="text-sectiontitle text-white font-medium text-right max-w-[60%]">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {allCredits.length > 0 && (
              <div>
                <p className="text-metatitle tracking-[0.25em] uppercase text-primary font-medium mb-4">
                  ✦ Career Highlights
                </p>
                <div className="relative pl-6">
                  <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-primary via-primary-600 to-transparent" />
                  <div className="space-y-4">
                    {[...allCredits]
                      .filter((c: any) => c.releaseDate || c.firstAirDate)
                      .sort((a: any, b: any) => {
                        const aYear = parseInt((a.releaseDate ?? a.firstAirDate ?? '0').substring(0, 4));
                        const bYear = parseInt((b.releaseDate ?? b.firstAirDate ?? '0').substring(0, 4));
                        return bYear - aYear;
                      })
                      .slice(0, 8)
                      .map((credit: any, i: number) => {
                        const year = (credit.releaseDate ?? credit.firstAirDate ?? '').substring(0, 4);
                        return (
                          <div
                            key={credit.id ?? i}
                            className="relative flex items-start gap-4"
                            style={{
                              opacity: 0,
                              animation: `fadeSlideUp 0.4s ease forwards`,
                              animationDelay: `${i * 0.07}s`,
                            }}
                          >
                            <div
                              className="absolute top-1.5 w-2.5 h-2.5 rounded-full bg-primary"
                              style={{ left: '-1.35rem', boxShadow: '0 0 0 3px rgba(20,184,166,0.25)' }}
                            />
                            <div className="flex-1 pb-4 border-b border-strokedark last:border-0">
                              <div className="flex justify-between items-start">
                                <p className="font-medium text-sectiontitle leading-snug text-white">
                                  {credit.displayTitle ?? credit.title ?? credit.name}
                                </p>
                                <span className="text-metatitle text-primary ml-3 shrink-0 font-medium">{year}</span>
                              </div>
                              {credit.character && (
                                <p className="text-metatitle text-waterloo mt-0.5">as {credit.character}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
                {allCredits.length > 8 && (
                  <button
                    onClick={() => setActiveTab('filmography')}
                    className="mt-5 text-sectiontitle text-primary hover:text-primary-400 transition-colors duration-200 font-medium flex items-center gap-1"
                  >
                    See full filmography ({totalCredits} titles) →
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Filmography tab */}
        {activeTab === "filmography" && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            {movies.length > 0 ? (
              <>
                <p className="text-sectiontitle text-waterloo mb-6">{movies.length} movies</p>
                <MovieList movies={movies} />
              </>
            ) : (
              <p className="text-waterloo py-12 text-center">No movie credits found.</p>
            )}
          </div>
        )}

        {/* TV tab */}
        {activeTab === "tv" && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            {tvShows.length > 0 ? (
              <>
                <p className="text-sectiontitle text-waterloo mb-6">{tvShows.length} TV shows</p>
                <MovieList movies={tvShows} />
              </>
            ) : (
              <p className="text-waterloo py-12 text-center">No TV credits found.</p>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes expandWidth {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
};

export default Cast;