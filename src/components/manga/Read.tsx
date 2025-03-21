"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import ErrorMessage from "../common/ErrorMessage";
import { ReadMangaPageProps } from "@/types/WatchPageProps";
import Skeleton from "../common/Skeleton";
import { getMangaDetails } from "@/services/MangaService";
import { CustomTag } from "../common/CustomTag";
import { FaExpand, FaMinus, FaPlus, FaTimes, FaBars } from "react-icons/fa";
import { Input } from "../ui/primitives/input";

const ReadManga = ({ params }: ReadMangaPageProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const { id } = params;
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

  const {
    data: chaptersData,
    isLoading: chaptersLoading,
  } = useQuery({
    queryKey: ["chapters", mangaId],
    queryFn: async () => {
      const response = await fetch(`/api/manga/${mangaId}/chapters?language=en`);
      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        const sortedChapters = data.data.sort((a: any, b: any) => {
          const chA = parseFloat(a.attributes.chapter || '0');
          const chB = parseFloat(b.attributes.chapter || '0');
          return chA - chB;
        });
        setSelectedChapter(sortedChapters[0]?.id); // Set the first chapter as default
        return sortedChapters;
      }
      return [];
    },
    staleTime: 5 * 60 * 1000,
   
  });

  // Fetch chapter pages with React Query
  const {
    data: pagesData,
    isLoading: pagesLoading,
  } = useQuery({
    queryKey: ["chapterPages", selectedChapter],
    queryFn: async () => {
      if (!selectedChapter) return { pages: [] };
      
      const response = await fetch(`/api/chapter/${selectedChapter}/pages`);
      const data = await response.json();
      return data;
    },
    enabled: !!selectedChapter,
    staleTime: 5 * 60 * 1000,
  });

  const chapters = chaptersData || [];
  const pageImages = pagesData?.pages || [];
  const manga = mangaData?.data;

  const handleChapterChange = (value: string) => {
    setSelectedChapter(value);
    // Close sidebar automatically on mobile after selecting a chapter
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const incrementZoom = () => {
    setZoom(Math.min(zoom + 10, 100));
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
              <span className="text-md px-2 border-x border-[rgb(31,41,55)]">{zoom}%</span>
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
              className="p-1 text-md bg-[rgb(31,41,55)] rounded text-gray-400 hover:text-white"
              title="Toggle fullscreen"
            >
              <FaExpand size={18} />
            </button>
          </div>
        </div>

        {/* Reader content */}
        <div className="flex-1 overflow-y-auto bg-[#111827]">
          {pagesLoading ? (
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
        <div className="fixed md:relative w-[100%] md:w-60 h-full bg-[#111827] border-l border-[rgb(31,41,55)] flex flex-col overflow-hidden transition-all duration-300 z-40 left-0">
          {/* Sidebar header with close button for mobile */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-[rgb(31,41,55)] md:hidden">
            <h2 className="text-md font-medium">Chapters</h2>
            
          </div>

          {/* Compact Manga info */}
          <div className="p-2 border-b border-[rgb(31,41,55)]">
            <div className="flex items-start gap-2">
              <div className="w-12 h-16 overflow-hidden rounded flex-shrink-0">
                {manga.coverImage ? (
                  <img
                    src={`${baseUrl}api/File/image?url=${manga.coverImage}`}
                    alt={manga.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-[rgb(31,41,55)] flex items-center justify-center">
                    <p className="text-xs text-gray-500">No cover</p>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-md font-bold line-clamp-2">{manga.title}</h1>
                <div className="flex flex-wrap items-center text-xs text-gray-400 mt-1 gap-x-2">
                  <span>{manga.status || "Unknown"}</span>
                  <span>{manga.releaseDate ? new Date(manga.releaseDate).toLocaleDateString() : "Unknown"}</span>
                </div>
                {manga.genres && manga.genres.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {manga.genres.slice(0, 2).map((genre: string, idx: number) => (
                      <CustomTag color="bg-gray-800/80 hover:bg-gray-700/80 transition-colors"
                      key={idx} text={genre} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Compact search box */}
          <div className="px-2 py-1.5 border-b border-[rgb(31,41,55)]">
            <Input
              type="text"
              placeholder="Search chapters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-8 bg-[rgb(31,41,55)] border-[rgb(31,41,55)] text-md py-1 px-2"
            />
          </div>

          {/* Optimized chapter list */}
          <div className="flex-1 overflow-y-auto">
            {chaptersLoading ? (
              <div className="p-2">
                <Skeleton rows={5} />
              </div>
            ) : filteredChapters.length === 0 ? (
              <p className="p-2 text-xs text-gray-500">
                {chapters.length === 0 ? "No chapters available" : "No matching chapters found"}
              </p>
            ) : (
              <div className="flex flex-col">
                {filteredChapters.map((chapter) => {
                  const chNum = chapter.attributes.chapter || "N/A";
                  const chTitle = chapter.attributes.title || `Chapter ${chNum}`;

                  return (
                    <button
                      key={chapter.id}
                      onClick={() => handleChapterChange(chapter.id)}
                      className={`text-left px-2 py-1 hover:bg-gray-800/30 border-b border-[rgb(31,41,55)] transition-colors ${
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