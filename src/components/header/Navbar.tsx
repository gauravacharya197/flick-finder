"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { FaSearch, FaFilter } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import LoginPartial from "../auth/UserMenu";
import menuData from "./menuData";
import { SiteName } from "../common/SiteName";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setQuery } from "@/redux/movies/advanceSearchSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { IoMdClose } from "react-icons/io";
import useClickOutside from "@/hooks/useClickOutside";
import { RobotSearchModal } from "../common/RobotSearchModal";
import Spinner from "../common/Spin";

// Maximum search query character length
const MAX_SEARCH_CHARS = 50;

const MyNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { query } = useSelector((state: RootState) => state.advanceSearch);
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query");
  const [isPending, startTransition] = useTransition();
  const [charCount, setCharCount] = useState(0);
  
  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim())
      startTransition(() => {
        router.push(`/results?query=${encodeURIComponent(query)}`);
        setShowSearch(false); // Close mobile search after submission
      });
  };
  
  // Handle search close
  const handleClose = () => {
    if (searchQuery) {
      router.push("/results");
    }
    setShowSearch(false);
    dispatch(setQuery(""));
    setCharCount(0);
  };
  
  // Input change handler with character limit
  const handleInputChange = (e) => {
    const input = e.target.value;
    if (input.length <= MAX_SEARCH_CHARS) {
      dispatch(setQuery(input));
      setCharCount(input.length);
    }
  };
  
  const initializedFromUrl = useRef(false);
  
  // Effect to sync URL query parameter with Redux state on initial load
  useEffect(() => {
    if (!initializedFromUrl.current && searchQuery && searchQuery !== query) {
      const limitedQuery = searchQuery.slice(0, MAX_SEARCH_CHARS);
      dispatch(setQuery(limitedQuery));
      setCharCount(limitedQuery.length);
      initializedFromUrl.current = true;
    }
  }, [searchQuery, dispatch, query]);
  
  // Detect window resize for responsive adjustments
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && showSearch) {
        setShowSearch(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showSearch]);
  
  const menuButtonRef = useRef<any>(null);
  const menuContentRef = useRef<any>(null);
  
  // Using our custom hook for click outside handling
  useClickOutside(
    [menuButtonRef, menuContentRef],
    () => setMenuOpen(false),
    menuOpen,
  );

  // Filter button component
  const renderFilterButton = () => {
    return (
      <Link
        href="/results"
        onClick={() => setMenuOpen(false)}
        className="flex items-center gap-2 rounded bg-gray-200 px-3 py-1.5 text-sm md:px-4 md:text-base text-black hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        aria-label="Filter results"
      >
        <FaFilter className="h-3 w-3 md:h-3.5 md:w-3.5" />
        <span>Filter</span>
      </Link>
    );
  };
  
  // Search icons component
  const renderSearchControls = () => {
    return (
      <>
        {(query || searchQuery) && (
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-10 top-1/2 -translate-y-1/2 transform"
            aria-label="Clear search"
          >
            <IoMdClose className="text-xl md:text-2xl text-primary" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 transform text-primary"
          aria-label="Search"
        >
          {isPending ? <Spinner /> : <FaSearch className="h-4 w-4 md:h-5 md:w-5" />}
        </button>
      </>
    );
  };
  
  // Search input with character counter
  const renderSearchInput = () => {
    return (
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search Movies/TV"
          value={query}
          onChange={handleInputChange}
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-1.5 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          maxLength={MAX_SEARCH_CHARS}
          aria-label="Search input"
        />
        <span className={`absolute right-12 top-1/2 -translate-y-1/2 text-xs ${charCount >= MAX_SEARCH_CHARS ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
          {charCount}/{MAX_SEARCH_CHARS}
        </span>
        {renderSearchControls()}
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-300 bg-opacity-90 text-white dark:bg-background dark:text-white shadow-md">
      <div className="px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-48">
        <div className="flex h-14 items-center justify-between">
          {/* Left section: Menu button and logo */}
          <div className="relative flex items-center gap-2 sm:gap-4">
            <button
              ref={menuButtonRef}
              className="rounded-md p-1 hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Menu"
              aria-expanded={menuOpen}
            >
              {!menuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 5.75h16.5M3.75 12h16.5m-16.5 6.25h16.5"
                  />
                </svg>
              ) : (
                <MdClose className="h-6 w-6" />
              )}
            </button>
            
            <Link
              href="/"
              className="rounded-md bg-primary px-2 py-1 text-sm font-bold text-black dark:bg-primary dark:text-black sm:px-3 md:text-xl"
            >
              <SiteName />
            </Link>
            
            {/* Hamburger Menu Content */}
            <div
              ref={menuContentRef}
              className={`absolute left-0 top-full z-40 w-56 md:w-64 overflow-hidden rounded-md bg-black bg-opacity-95 shadow-lg backdrop-blur-sm transition-all duration-300 dark:bg-background ${
                menuOpen
                  ? "visible translate-y-0 opacity-100"
                  : "invisible -translate-y-2 opacity-0"
              }`}
            >
              <div className="flex flex-col">
                <ul className="space-y-2 py-2">
                  {menuData.map((item, index) => (
                    <li key={item.id}>
                      <Link
                        href={item.path || "#"}
                        className="block px-4 py-2 text-white hover:bg-gray-800 hover:text-primary dark:hover:bg-gray-700 dark:hover:text-primary transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* AI Search - visible on all screen sizes */}
            <div>
              <RobotSearchModal />
            </div>
          </div>

          {/* Middle section: Search Bar for medium+ screens */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-2 mx-4">
            <div className="flex items-center gap-2 w-full max-w-lg lg:max-w-xl xl:max-w-2xl">
              {renderFilterButton()}
              <form onSubmit={handleSearch} className="relative w-full">
                {renderSearchInput()}
              </form>
            </div>
          </div>
          
          {/* Small Screen: Search Icon, Login Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              className="rounded-md p-2 hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Toggle Search"
              aria-expanded={showSearch}
            >
              <FaSearch className="h-5 w-5 text-primary" />
            </button>
            <LoginPartial />
          </div>
          
          {/* Large Screen: Login */}
          <div className="hidden md:flex items-center gap-4">
            <LoginPartial />
          </div>
        </div>
      </div>
      
      {/* Search Bar for Small Screens - Slide down animation */}
      <div 
        className={`bg-white bg-opacity-90 dark:bg-background transform transition-all duration-300 overflow-hidden ${
          showSearch ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
        } md:hidden`}
      >
        {showSearch && (
          <div className="container mx-auto p-2 flex items-center gap-2">
            {renderFilterButton()}
            <form onSubmit={handleSearch} className="relative flex-1">
              {renderSearchInput()}
            </form>
            <button
              className="rounded-md p-1.5 text-red-500 hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              onClick={() => setShowSearch(false)}
              aria-label="Close Search"
            >
              <MdClose className="text-xl" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default MyNav;