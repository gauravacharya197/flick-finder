'use client'
import { Metadata } from "next";
import { siteConfig } from "@/config/siteConfig";
import Container from "@/components/common/Container";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { 
  FaPlay, FaSearch, FaStar, FaShieldAlt, 
  FaGem, FaPlus, FaMinus, FaFire
} from 'react-icons/fa';
import { getMovies } from "@/services/MovieService";

export const metadata: Metadata = {
  title: `Flickday - Free Movies & TV Shows Online Streaming`,
  description: `Stream unlimited movies and TV shows for free on Flickday. HD quality, no subscription required.`,
  alternates: { canonical: siteConfig.url }
};

function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/results?query=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
      <div className="relative">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies and TV shows..."
          className="w-full pl-12 pr-20 py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
}

function FeaturedContent() {
  const { data: trendingMovies, isLoading } = useInfiniteQuery({
    queryKey: ["trending", "AllTrending"],
    queryFn: async () => getMovies("Trending"),
    getNextPageParam: () => null,
    initialPageParam: 1,
    staleTime: 1000 * 60 * 60 * 24,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[2/3] bg-white/5 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const trending = trendingMovies?.pages.flatMap((page) => page.data.results) || [];
  const featured = trending.slice(0, 6);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {featured.map((movie, index) => (
        <div key={index} className="group cursor-pointer">
          <div className="aspect-[2/3] relative overflow-hidden rounded-xl bg-white/5">
            <Image
              src={movie.posterPath ? `https://image.tmdb.org/t/p/w500${movie.posterPath}` : '/placeholder-movie.jpg'}
              alt={movie.displayTitle || movie.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-2 left-2 right-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 bg-black/70 px-2 py-1 rounded">
                    <FaStar className="text-yellow-400 w-3 h-3" />
                    <span>{movie.voteAverage?.toFixed(1) || 'N/A'}</span>
                  </div>
                  <span className="bg-black/70 px-2 py-1 rounded">
                    {movie.displayReleaseDate?.split('-')[0] || 'TBA'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <h3 className="mt-2 text-sm font-medium text-white/90 truncate">
            {movie.displayTitle || movie.title}
          </h3>
        </div>
      ))}
    </div>
  );
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { 
      question: "Is Flickday really free?", 
      answer: "Yes, completely free with no subscription fees or hidden costs." 
    },
    { 
      question: "Do I need to sign up?", 
      answer: "No registration required. Start watching instantly." 
    },
    { 
      question: "What quality is available?", 
      answer: "We offer HD, Full HD, and 4K quality for the best viewing experience." 
    },
    { 
      question: "Which devices are supported?", 
      answer: "All devices - phones, tablets, computers, and smart TVs." 
    }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-3">
      {faqs.map((faq, index) => (
        <div key={index} className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full px-6 py-4 text-left flex justify-between items-center"
          >
            <h3 className="font-medium text-white">{faq.question}</h3>
            {openIndex === index ? 
              <FaMinus className="text-blue-400 flex-shrink-0" /> : 
              <FaPlus className="text-gray-400 flex-shrink-0" />
            }
          </button>
          {openIndex === index && (
            <div className="px-6 pb-4 border-t border-white/10 pt-3">
              <p className="text-gray-300 text-sm">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const { data: trendingMovies } = useInfiniteQuery({
    queryKey: ["trending", "AllTrending"],
    queryFn: async () => getMovies("Trending"),
    getNextPageParam: () => null,
    initialPageParam: 1,
    staleTime: 1000 * 60 * 60 * 24,
  });

  const trending = trendingMovies?.pages.flatMap((page) => page.data.results) || [];
  const heroBackdrop = trending[0]?.backdropPath;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Background Image */}
      {heroBackdrop && (
        <div className="fixed inset-0">
          <Image
            src={`https://image.tmdb.org/t/p/original${heroBackdrop}`}
            alt="Background"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80  to-slate-900/80" />
        </div>
      )}

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <Container>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/30 text-blue-300 text-sm font-medium mb-8">
              <FaFire className="w-4 h-4" />
              Free Streaming Platform
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Flickday
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Stream thousands of movies and TV shows in HD quality, completely free
            </p>

            <SearchBar />

            <div className="flex justify-center gap-4 mt-8 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-500/30">
                <FaShieldAlt className="text-emerald-400" />
                <span className="text-emerald-300">100% Free</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/30">
                <FaGem className="text-purple-400" />
                <span className="text-purple-300">4K Quality</span>
              </div>
            </div>
          </Container>
        </section>

        {/* Featured Content */}
        <section className="py-16">
          <Container>
            <h2 className="text-3xl font-bold mb-8 text-center">Trending Now</h2>
            <FeaturedContent />
          </Container>
        </section>

        {/* Features */}
        <section className="py-16 bg-white/5 backdrop-blur-sm">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Flickday?</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                The best free streaming experience with premium features
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-2xl flex items-center justify-center">
                  <FaShieldAlt className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Completely Free</h3>
                <p className="text-gray-400">No subscription or payment required ever</p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-600 rounded-2xl flex items-center justify-center">
                  <FaGem className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
                <p className="text-gray-400">HD and 4K streaming on all devices</p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-emerald-600 rounded-2xl flex items-center justify-center">
                  <FaPlay className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Instant Access</h3>
                <p className="text-gray-400">Start watching immediately, no signup needed</p>
              </div>
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-400">Everything you need to know about Flickday</p>
            </div>
            <FAQ />
          </Container>
        </section>

        {/* CTA */}
        <section className="py-16 text-center">
          <Container>
            <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold mb-4">Ready to Start Watching?</h2>
              <p className="text-gray-400 mb-8">Join millions of users streaming for free on Flickday</p>
              <Link
                href="/"
                className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-colors"
              >
                <FaPlay className="w-5 h-5" />
                Start Streaming Now
              </Link>
            </div>
          </Container>
        </section>
      </div>
    </div>
  );
}