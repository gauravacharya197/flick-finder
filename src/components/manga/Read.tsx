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

import SectionHeader from "../common/SectionHeader";
import ErrorMessage from "../common/ErrorMessage";
import { ReadMangaPageProps } from "@/types/WatchPageProps";
import Skeleton from "../common/Skeleton";
import { getMangaDetails } from "@/services/MangaService";
import { Button } from "../ui/primitives/button";
import { CustomTag } from "../common/CustomTag";
import { FaBookOpen, FaChevronLeft, FaChevronRight } from "react-icons/fa";

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
  const [showControls, setShowControls] = useState(true);

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
      window.scrollTo(0, 0);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pageImages.length - 1) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleChapterChange = (value: string) => {
    setSelectedChapter(value);
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

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
    <div className="max-w-7xl mx-auto px-4 py-6 bg-background min-h-screen">
      {/* Manga info header - Card based */}
      <Card className="mb-6 overflow-hidden shadow-md">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
            {/* Cover image */}
            <div className="col-span-1 bg-background">
              {manga.coverImage ? (
                <img 
                  src={manga.coverImage} 
                  alt={manga.title} 
                  className="w-full h-full object-cover max-h-96 md:max-h-full"
                />
              ) : (
                <div className="w-full h-64 md:h-full bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">No cover image</p>
                </div>
              )}
            </div>
            
            {/* Manga details */}
            <div className="col-span-1 md:col-span-3 p-6">
              <h1 className="text-2xl md:text-3xl font-bold mb-3 text-white">{manga.title}</h1>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <CustomTag text=  {manga.status || "Unknown status"}/>
                 
                
                {manga.releaseDate && (
                                  <CustomTag text=  {new Date(manga.releaseDate).toLocaleDateString()}/>

                 
                )}
              </div>
              
              {manga.genres && manga.genres.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {manga.genres.map((genre: string, index: number) => (
                      <span key={index}  className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {manga.authors && manga.authors.length > 0 && (
                  <div>
                    <span className="text-gray-600 font-medium">Authors: </span>
                    {manga.authors.join(", ")}
                  </div>
                )}
                
                {manga.rating && (
                  <div>
                    <span className="text-gray-600 font-medium">Rating: </span>
                    <span className="font-semibold">{manga.rating}/10</span>
                  </div>
                )}
              </div>
              
              {manga.description && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2 text-white">Description</h3>
                  <p className="text-white text-sm md:text-base line-clamp-4 md:line-clamp-none">
                    {manga.description.split('---')[0].trim()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chapter navigation and reader controls */}
      <Card className="mb-6 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
             
              {loading ? (
                <div className="h-10 w-full bg-background animate-pulse rounded"></div>
              ) : chapters.length === 0 ? (
                <p className="text-gray-500">No chapters available</p>
              ) : (
                <div className="w-full max-w-xs">
                  <Select 
                    value={selectedChapter || ""} 
                    onValueChange={handleChapterChange} 
                    disabled={loading}
                  >
                   <SelectTrigger className="max-full border-gray-700 bg-gray-800 ring-0 focus:ring-0 focus:ring-offset-0  text-white">

                      <SelectValue placeholder="Select a chapter" />
                    </SelectTrigger>
                    <SelectContent className="border-gray-700 bg-gray-800 text-gray-100">

                      <SelectGroup>
                        <SelectLabel>Chapters</SelectLabel>
                        {chapters.map((chapter) => (
                          <SelectItem key={chapter.id} value={chapter.id}>
                            Chapter {chapter.attributes.chapter || "N/A"}
                            {chapter.attributes.title ? ` - ${chapter.attributes.title}` : ""}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            {selectedChapter && pageImages.length > 0 && (
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex items-center gap-2">
                  
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => prevChapter && setSelectedChapter(prevChapter.id)}
                          disabled={!prevChapter}
                          className="px-3"
                        >
                          <FaChevronLeft className="h-5 w-5" />
                          <span className="sr-md:not-sr-only ml-1">Prev Chapter</span>
                        </Button>
                      
                        
                    
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => nextChapter && setSelectedChapter(nextChapter.id)}
                          disabled={!nextChapter}
                          className="px-3"
                        >
                          <span className="sr-md:not-sr-only mr-1">Next Chapter</span>
                          <FaChevronRight className="h-5 w-5" />
                        </Button>
                     
                     
                </div>
                
                <span className="ml-2">
                  Page {currentPage + 1} of {pageImages.length}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chapter reader */}
      {selectedChapter && (
        <Card className="mb-8 shadow-md overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gray-800 text-white p-4">
              <h2 className="text-xl font-semibold">
                Chapter {chapterNumber}
                {chapterTitle && <span className="text-gray-300 ml-2">- {chapterTitle}</span>}
              </h2>
            </div>

            {chapterLoading ? (
              <div className="flex justify-center items-center h-96 bg-gray-50 p-4">
                <Skeleton rows={7} />
              </div>
            ) : pageImages.length === 0 ? (
              <div className="flex justify-center items-center h-96 bg-gray-50 p-4">
                <p className="text-gray-500">No images available for this chapter</p>
              </div>
            ) : (
              <div className="relative" onClick={toggleControls}>
                <div className="flex flex-col items-center bg-black">
                  <img
                    src={pageImages[currentPage]}
                    alt={`Page ${currentPage + 1}`}
                    className="max-w-full max-h-screen object-contain"
                    loading="eager"
                  />
                </div>

                {/* Floating page controls */}
                {showControls && (
                  <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10 bg-gray-900/80 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-3 text-white shadow-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevPage();
                      }}
                      disabled={currentPage === 0}
                      className="text-white hover:bg-white/20 rounded-full"
                    >
                      <FaChevronLeft className="h-6 w-6" />
                    </Button>
                    
                    <span className="text-sm font-medium px-2">
                      {currentPage + 1} / {pageImages.length}
                    </span>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextPage();
                      }}
                      disabled={currentPage === pageImages.length - 1}
                      className="text-white hover:bg-white/20 rounded-full"
                    >
                      <FaChevronRight className="h-6 w-6" />
                    </Button>
                  </div>
                )}
                
                {/* Invisible click areas for page navigation */}
                <div 
                  className="absolute top-0 left-0 w-1/3 h-full cursor-pointer opacity-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevPage();
                  }}
                />
                <div 
                  className="absolute top-0 right-0 w-1/3 h-full cursor-pointer opacity-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextPage();
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Keyboard shortcuts info */}
      <div className="text-center text-gray-500 text-sm mb-6">
        <p>Tip: Use keyboard arrow keys (← →) to navigate between pages</p>
      </div>
    </div>
  );
};

export default ReadManga;