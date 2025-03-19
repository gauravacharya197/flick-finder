"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { Card, CardContent } from "@/components/ui/primitives/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

import ErrorMessage from "../common/ErrorMessage";
import { ReadMangaPageProps } from "@/types/WatchPageProps";
import Skeleton from "../common/Skeleton";
import { getMangaDetails } from "@/services/MangaService";
import { Button } from "../ui/primitives/button";
import { CustomTag } from "../common/CustomTag";
import { FaChevronLeft, FaChevronRight, FaExpand, FaMinus, FaPlus, FaSearch, FaTimes, FaBars } from "react-icons/fa";
import { Input } from "../ui/primitives/input";

const ReadManga = ({ params }: ReadMangaPageProps) => {
  const { id, title } = params;
  const [chapters, setChapters] = useState<any[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [chapterLoading, setChapterLoading] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Hidden by default
  const [searchTerm, setSearchTerm] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  if (!id) {
    return <ErrorMessage message="Error: Missing required parameters" />;
  }

  const mangaId = id;

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Fetch manga details
  const {
    data: mangaData,
    isLoading,
    isError,
    error,
  } = useQuery<AxiosResponse<any>>({
    queryKey: ["manga", id],
    queryFn: () => getMangaDetails(id.toString()),
    staleTime: 5 * 60 * 1000,
  });

  const manga = mangaData?.data;

  // Fetch chapters for this manga
  useEffect(() => {
    const fetchChapters = async () => {
      if (!mangaId) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/manga/${mangaId}/chapters?language=en`);
        const data = await response.json();

        if (data.data && Array.isArray(data.data)) {
          const sortedChapters = data.data.sort((a: any, b: any) => {
            const chA = parseFloat(a.attributes.chapter || '0');
            const chB = parseFloat(b.attributes.chapter || '0');
            return chA - chB;
          });

          setChapters(sortedChapters);

          // Select first chapter by default
          if (sortedChapters.length > 0 && !selectedChapter) {
            setSelectedChapter(sortedChapters[0].id);
          }
        }
      } catch (err) {
        console.error("Error fetching chapters:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [mangaId]);

  // Fetch chapter pages when a chapter is selected
  useEffect(() => {
    const fetchChapterPages = async () => {
      if (!selectedChapter) return;

      setChapterLoading(true);
      setPageImages([]);

      try {
        const response = await fetch(`/api/chapter/${selectedChapter}/pages`);
        const data = await response.json();

        if (data.pages && Array.isArray(data.pages)) {
          setPageImages(data.pages);
        }
      } catch (err) {
        console.error("Error fetching chapter pages:", err);
      } finally {
        setChapterLoading(false);
      }
    };

    fetchChapterPages();
  }, [selectedChapter]);

  const handleChapterChange = (value: string) => {
    setSelectedChapter(value);
    // Close sidebar automatically on mobile after selecting a chapter
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const incrementZoom = () => {
    setZoom(Math.min(zoom + 10, 200));
  };

  const decrementZoom = () => {
    setZoom(Math.max(zoom - 10, 50));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        });
      }
    }
  };

  // Filter chapters based on search term
  const filteredChapters = chapters.filter(chapter => {
    const chapterNum = chapter.attributes.chapter || "";
    const chapterTitle = chapter.attributes.title || "";
    const searchLower = searchTerm.toLowerCase();

    return (
      chapterNum.toString().includes(searchLower) ||
      chapterTitle.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return <Skeleton />;
  }

  if (isError) {
    return <ErrorMessage message={error?.message || "Failed to load manga details"} />;
  }

  if (!manga) {
    return <ErrorMessage message="Manga data not available" />;
  }

  const currentChapterInfo = chapters.find(ch => ch.id === selectedChapter);
  const chapterNumber = currentChapterInfo?.attributes?.chapter || "N/A";
  const chapterTitle = currentChapterInfo?.attributes?.title || "";

  return (
    <div className="flex h-screen bg-background text-gray-200 overflow-hidden">
      {/* Main content (Manga page view) */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Reader header */}
        <div className="h-12 flex items-center justify-between border-b border-[rgb(31,41,55)] bg-[#111827] py-3 md:py-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleSidebar}
              className="md:px-2 md:py-1 p-1 bg-[rgb(31,41,55)] rounded text-md hover:bg-[rgb(31,41,55)] transition-colors"
            >
              <FaBars className="md:hidden" />
              <span className="hidden md:inline">
                {sidebarOpen ? "Hide Chapters" : "Show Chapters"}
              </span>
            </button>

            <div className="text-md truncate max-w-[60vw] md:max-w-none">
              <span className="font-medium">Chapter {chapterNumber}</span>
              {chapterTitle && <span className="text-gray-400 ml-2 hidden md:inline">{chapterTitle}</span>}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-[rgb(31,41,55)] rounded">
              <button
                onClick={decrementZoom}
                className="p-1 text-gray-400 hover:text-white"
                title="Zoom out"
              >
                <FaMinus size={12} />
              </button>
              <span className="text-sm px-2 border-x border-[rgb(31,41,55)]">{zoom}%</span>
              <button
                onClick={incrementZoom}
                className="p-1 text-gray-400 hover:text-white"
                title="Zoom in"
              >
                <FaPlus size={12} />
              </button>
            </div>

            <button
              onClick={toggleFullscreen}
              className="p-1 bg-[rgb(31,41,55)] rounded text-gray-400 hover:text-white"
              title="Toggle fullscreen"
            >
              <FaExpand size={14} />
            </button>
          </div>
        </div>

        {/* Reader content */}
        <div className="flex-1 overflow-y-auto bg-[#111827]">
          {chapterLoading ? (
            <div className="flex justify-center items-center h-full w-full">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-[rgb(31,41,55)] h-12 w-12"></div>
              </div>
            </div>
          ) : pageImages.length === 0 ? (
            <div className="flex justify-center items-center h-full w-full">
              <p className="text-gray-500">No images available for this chapter</p>
            </div>
          ) : (
            <div className="flex flex-col items-center py-2">
              {pageImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Page ${index + 1}`}
                  className="max-w-full mb-2 transition-all duration-200"
                  style={{ width: `${zoom}%` }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar (Chapters + Manga info) */}
      {sidebarOpen && (
        <div className="fixed md:relative w-full md:w-64 h-full bg-[#111827] border-l border-[rgb(31,41,55)] flex flex-col overflow-hidden transition-all duration-300 z-50">
          {/* Sidebar header with close button for mobile */}
          <div className="flex items-center justify-between pr-6 border-b border-[rgb(31,41,55)] md:hidden">
            <h2 className="font-medium">Chapters</h2>
            <button
              onClick={toggleSidebar}
              className="p-1 bg-[rgb(31,41,55)] rounded text-gray-400 hover:text-white"
            >
              <FaTimes size={16} />
            </button>
          </div>

          {/* Manga info */}
          <div className="p-2 border-b border-[rgb(31,41,55)]">
            <div className="flex items-center">
              <div className="w-16 h-20 overflow-hidden rounded mr-2">
                {manga.coverImage ? (
                  <img
                    src={manga.coverImage}
                    alt={manga.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[rgb(31,41,55)] flex items-center justify-center">
                    <p className="text-gray-500 text-sm">No cover</p>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-md font-bold line-clamp-2">{manga.title}</h1>
                <p className="text-sm text-gray-400 mt-1">Status: {manga.status || "Unknown"}</p>
                <p className="text-sm text-gray-400">Released: {manga.releaseDate ? new Date(manga.releaseDate).toLocaleDateString() : "Unknown"}</p>
                {manga.genres && manga.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {manga.genres.slice(0, 3).map((genre: string, idx: number) => (
                      <CustomTag key={idx} text={genre} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chapter list header with search */}
          <div className="p-2 border-b border-[rgb(31,41,55)]">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search chapters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[rgb(31,41,55)] border-[rgb(31,41,55)] text-md pl-8"
              />
              <FaSearch className="absolute left-2 top-2 text-gray-400" size={14} />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-2 text-gray-400 hover:text-white"
                >
                  <FaTimes size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Chapter list */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-2">
                <Skeleton rows={5} />
              </div>
            ) : filteredChapters.length === 0 ? (
              <p className="p-2 text-gray-500">
                {chapters.length === 0 ? "No chapters available" : "No matching chapters found"}
              </p>
            ) : (
              <div className="flex flex-col">
                {filteredChapters.map((chapter, index) => {
                  const chNum = chapter.attributes.chapter || "N/A";
                  const chTitle = chapter.attributes.title || `Chapter ${chNum}`;

                  return (
                    <button
                      key={chapter.id}
                      onClick={() => handleChapterChange(chapter.id)}
                      className={`text-left px-2 py-1.5 hover:bg-[rgb(31,41,55)] border-b border-[rgb(31,41,55)] transition-colors ${
                        selectedChapter === chapter.id ? 'bg-[rgb(31,41,55)] font-medium' : ''
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-md font-medium">Chapter {chNum}</span>
                        {chTitle !== `Chapter ${chNum}` && (
                          <span className="text-sm text-gray-400 truncate">{chTitle}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadManga;