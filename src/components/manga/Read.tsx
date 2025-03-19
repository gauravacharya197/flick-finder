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
import { FaChevronLeft, FaChevronRight, FaExpand, FaMinus, FaPlus, FaSearch, FaTimes } from "react-icons/fa";
import { Input } from "../ui/primitives/input";

const ReadManga = ({ params }: ReadMangaPageProps) => {
  // Destructure params
  const { id, title } = params;
  const [chapters, setChapters] = useState<any[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [chapterData, setChapterData] = useState<any>(null);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [chapterLoading, setChapterLoading] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!id) {
    return <ErrorMessage message="Error: Missing required parameters" />;
  }

  const mangaId = id;

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
          // Sort chapters by number
          const sortedChapters = data.data.sort((a: any, b: any) => {
            const chA = parseFloat(a.attributes.chapter || '0');
            const chB = parseFloat(b.attributes.chapter || '0');
            return chA - chB;
          });
          
          setChapters(sortedChapters);
          
          // Select first chapter by default if available
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
      setCurrentPage(0);
      setPageImages([]);
      
      try {
        const response = await fetch(`/api/chapter/${selectedChapter}/pages`);
        const data = await response.json();
        
        if (data.chapter) {
          setChapterData(data.chapter);
        }
        
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

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pageImages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleChapterChange = (value: string) => {
    setSelectedChapter(value);
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevPage();
      } else if (e.key === "ArrowRight") {
        handleNextPage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, pageImages.length]);

  if (isLoading) {
    return <Skeleton />;
  }

  if (isError) {
    return <ErrorMessage message={error?.message || "Failed to load manga details"} />;
  }

  if (!manga) {
    return <ErrorMessage message="Manga data not available" />;
  }
  
  // Find the current chapter information
  const currentChapterInfo = chapters.find(ch => ch.id === selectedChapter);
  const chapterNumber = currentChapterInfo?.attributes?.chapter || "N/A";
  const chapterTitle = currentChapterInfo?.attributes?.title || "";
  
  // Find next and previous chapters
  const currentIndex = chapters.findIndex(ch => ch.id === selectedChapter);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  return (
    <div className="flex h-screen bg-neutral-900 text-gray-200 overflow-hidden">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-80 h-full bg-black border-r border-neutral-800 flex flex-col overflow-hidden">
          {/* Manga info */}
          <div className="p-4 border-b border-neutral-800">
            <div className="flex items-center mb-4">
              <div className="w-24 h-32 overflow-hidden rounded mr-3">
                {manga.coverImage ? (
                  <img 
                    src={manga.coverImage} 
                    alt={manga.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                    <p className="text-gray-500">No cover</p>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-lg font-bold line-clamp-2">{manga.title}</h1>
                <p className="text-xs text-gray-400 mt-1">Status: {manga.status || "Unknown"}</p>
                <p className="text-xs text-gray-400">Released: {manga.releaseDate ? new Date(manga.releaseDate).toLocaleDateString() : "Unknown"}</p>
                {manga.genres && manga.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {manga.genres.slice(0, 3).map((genre: string, idx: number) => (
                      <CustomTag key={idx} text={genre} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Chapter list header with search */}
          <div className="p-3 border-b border-neutral-800">
            <h2 className="text-md font-semibold mb-2">Chapters</h2>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search chapters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-neutral-800 border-neutral-700 text-sm pl-8"
              />
              <FaSearch className="absolute left-2.5 top-2.5 text-gray-400" size={14} />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-white"
                >
                  <FaTimes size={14} />
                </button>
              )}
            </div>
          </div>
          
          {/* Chapter list */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4">
                <Skeleton rows={5} />
              </div>
            ) : filteredChapters.length === 0 ? (
              <p className="p-4 text-gray-500">
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
                      className={`text-left px-4 py-3 hover:bg-neutral-800 border-b border-neutral-800 transition-colors ${
                        selectedChapter === chapter.id ? 'bg-neutral-800 font-medium' : ''
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">Chapter {chNum}</span>
                        {chTitle !== `Chapter ${chNum}` && (
                          <span className="text-xs text-gray-400 truncate">{chTitle}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Manga description */}
          
        </div>
      )}
      
      {/* Main content */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Reader header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-neutral-800 bg-black">
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleSidebar}
              className="px-3 py-1.5 bg-neutral-800 rounded text-sm hover:bg-neutral-700 transition-colors"
            >
              {sidebarOpen ? "Hide Chapters" : "Show Chapters"}
            </button>
            
            <div className="text-sm">
              <span className="font-medium">Chapter {chapterNumber}</span>
              {chapterTitle && <span className="text-gray-400 ml-2">{chapterTitle}</span>}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-neutral-800 rounded">
              <button
                onClick={decrementZoom}
                className="p-1.5 text-gray-400 hover:text-white"
                title="Zoom out"
              >
                <FaMinus size={12} />
              </button>
              <span className="text-xs px-2 border-x border-neutral-700">{zoom}%</span>
              <button
                onClick={incrementZoom}
                className="p-1.5 text-gray-400 hover:text-white"
                title="Zoom in"
              >
                <FaPlus size={12} />
              </button>
            </div>
            
            <button
              onClick={toggleFullscreen}
              className="p-1.5 bg-neutral-800 rounded text-gray-400 hover:text-white"
              title="Toggle fullscreen"
            >
              <FaExpand size={14} />
            </button>
          </div>
        </div>
        
        {/* Reader content */}
        <div className="flex-1 overflow-auto bg-neutral-900 flex justify-center relative">
          {chapterLoading ? (
            <div className="flex justify-center items-center h-full w-full">
              <Skeleton rows={7} />
            </div>
          ) : pageImages.length === 0 ? (
            <div className="flex justify-center items-center h-full w-full">
              <p className="text-gray-500">No images available for this chapter</p>
            </div>
          ) : (
            <>
              {/* Left navigation area */}
              <div 
                className="absolute left-0 top-0 w-1/4 h-full cursor-pointer z-10"
                onClick={handlePrevPage}
              />
              
              {/* Right navigation area */}
              <div 
                className="absolute right-0 top-0 w-1/4 h-full cursor-pointer z-10"
                onClick={handleNextPage}
              />
              
              {/* Image container */}
              <div className="flex justify-center items-center min-h-full py-4">
                <img
                  src={pageImages[currentPage]}
                  alt={`Page ${currentPage + 1}`}
                  className="max-h-full object-contain transition-all duration-200"
                  style={{ width: `${zoom}%` }}
                />
              </div>
            </>
          )}
        </div>
        
        {/* Reader footer */}
        <div className="h-14 flex items-center justify-between px-4 border-t border-neutral-800 bg-black">
          <div className="flex items-center space-x-4">
            {prevChapter && (
              <button
                onClick={() => setSelectedChapter(prevChapter.id)}
                className="px-3 py-1.5 bg-neutral-800 rounded text-sm hover:bg-neutral-700 transition-colors flex items-center"
              >
                <FaChevronLeft size={10} className="mr-1" />
                Prev Chapter
              </button>
            )}
            
            <div className="flex items-center bg-neutral-800 rounded overflow-hidden">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className={`p-2 ${
                  currentPage === 0 ? 'text-gray-600' : 'text-gray-300 hover:bg-neutral-700'
                }`}
              >
                <FaChevronLeft size={12} />
              </button>
              <div className="px-3 py-1 border-x border-neutral-700">
                <span className="text-sm">
                  {currentPage + 1} / {pageImages.length}
                </span>
              </div>
              <button
                onClick={handleNextPage}
                disabled={currentPage === pageImages.length - 1}
                className={`p-2 ${
                  currentPage === pageImages.length - 1 ? 'text-gray-600' : 'text-gray-300 hover:bg-neutral-700'
                }`}
              >
                <FaChevronRight size={12} />
              </button>
            </div>
          </div>
          
          <div>
            {nextChapter && (
              <button
                onClick={() => setSelectedChapter(nextChapter.id)}
                className="px-3 py-1.5 bg-neutral-800 rounded text-sm hover:bg-neutral-700 transition-colors flex items-center"
              >
                Next Chapter
                <FaChevronRight size={10} className="ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadManga;