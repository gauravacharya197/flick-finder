"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { FaSearch, FaFilter } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setQuery } from "@/redux/movies/advanceSearchSlice";
import useClickOutside from "@/hooks/useClickOutside";

import UserMenu from "../auth/UserMenu";
import { SiteName } from "../common/SiteName";
import { RobotSearchModal } from "../common/RobotSearchModal";
import Spinner from "../common/Spin";
import menuData from "./menuData";

const MyNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { query } = useSelector((state: RootState) => state.advanceSearch);
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query");
  const [isPending, startTransition] = useTransition();
  
  const menuButtonRef = useRef<any>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const initializedFromUrl = useRef(false);
  
  // Initialize search query from URL
  useEffect(() => {
    if (!initializedFromUrl.current && searchQuery && searchQuery !== query) {
      dispatch(setQuery(searchQuery));
      initializedFromUrl.current = true;
    }
  }, [searchQuery, dispatch, query]);
  
  // Close menu when clicking outside
  useClickOutside([menuButtonRef, menuContentRef], () => setMenuOpen(false), menuOpen);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      startTransition(() => router.push(`/results?query=${encodeURIComponent(query)}`));
    }
  };
  
  const handleClose = () => {
    if (searchQuery) router.push("/results");
    dispatch(setQuery(""));
  };

  // Component for search input with close and search buttons
  const SearchInput = ({ className = "", autoFocus = false }) => (
    <form onSubmit={handleSearch} className="relative flex-1">
      <input
        type="text"
        value={query}
        onChange={(e) => dispatch(setQuery(e.target.value))}
        placeholder="Search Movies/TV"
        className={`w-full rounded-md px-4 py-1.5 text-black dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
        autoFocus={autoFocus}
      />
      {(query || searchQuery) && (
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-8 top-1/2 -translate-y-1/2 transform"
        >
          <IoMdClose className="text-xl text-primary md:text-2xl" />
        </button>
      )}
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 transform text-primary"
        aria-label="Search"
      >
        {isPending ? <Spinner /> : <FaSearch className="h-4 w-4 md:h-5 md:w-5" />}
      </button>
    </form>
  );
  
  // Filter button component
  const FilterButton = () => (
    <Link
      href="/results"
      onClick={() => setMenuOpen(false)}
      className="flex items-center gap-2 rounded bg-gray-200 px-3 py-1.5 text-black hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
    >
      <FaFilter className="h-3 w-3 md:h-3.5 md:w-3.5" />
      Filter
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 bg-gray-300 bg-opacity-90 text-white dark:bg-background">
      <div className="px-3 sm:px-4 lg:px-8 xl:px-12 2xl:px-48">
        <div className="flex h-13 items-center justify-between">
          {/* Left section: Menu, Logo, Dropdown */}
          <div className="relative flex items-center gap-2 sm:gap-4">
            <button
              ref={menuButtonRef}
              className="rounded-md p-1 hover:bg-gray-800 dark:hover:bg-gray-700"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Menu"
            >
              {!menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-7 w-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.75h16.5M3.75 12h16.5m-16.5 6.25h16.5" />
                </svg>
              ) : (
                <MdClose className="h-7 w-7" />
              )}
            </button>
            
            <Link href="/" className="rounded-md bg-primary px-2 py-1 font-bold text-black sm:px-3 md:text-xl">
              <SiteName />
            </Link>

            {/* SEO-friendly menu links - always in the DOM but visually hidden when not active */}
            <div
              ref={menuContentRef}
              className={`absolute left-0 top-full z-40 rounded-md bg-black bg-opacity-95 shadow-lg transition-all duration-100 dark:bg-background ${
                menuOpen ? "visible opacity-100" : "invisible -translate-y-2 opacity-0 pointer-events-none"
              }`}
              aria-hidden={!menuOpen}
            >
              <ul className="space-y-3 pt-3">
                {menuData.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.path || "#"}
                      className="block px-4 py-1 text-white hover:bg-gray-800 hover:text-primary dark:hover:bg-gray-700"
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <RobotSearchModal />
          </div>

          {/* Center: Desktop search bar */}
          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 transform md:block">
            <div className="flex items-center gap-2">
              <FilterButton />
              <div className="relative">
                <SearchInput className="w-64 lg:w-80 xl:w-96" autoFocus />
              </div>
            </div>
          </div>
          
          {/* Spacer for layout */}
          <div className="hidden md:block md:flex-1"></div>
          
          {/* Right: User menu and mobile search toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              className="rounded-md p-1.5 hover:bg-gray-800 dark:hover:bg-gray-700"
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Toggle Search"
            >
              <FaSearch className="h-5 w-5 text-primary" />
            </button>
            <UserMenu />
          </div>
          
          {/* Desktop user menu */}
          <div className="hidden items-center gap-4 md:flex">
            <UserMenu />
          </div>
        </div>
      </div>
      
      {/* Mobile search bar */}
      <div 
        ref={searchBarRef}
        className={`absolute left-0 right-0 z-40 bg-white bg-opacity-90 overflow-hidden transition-all duration-100 transform origin-top dark:bg-background md:hidden ${
          showSearch ? "max-h-20 opacity-100" : "max-h-0 opacity-0 -translate-y-2 scale-y-0"
        }`}
      >
        <div className="p-2 flex items-center gap-2">
          <FilterButton />
          <SearchInput autoFocus={showSearch} />
          <button
            className="rounded-md p-1.5 text-red-500 hover:bg-gray-700"
            onClick={() => setShowSearch(false)}
            aria-label="Close Search"
          >
            <MdClose className="text-xl" />
          </button>
        </div>
      </div>

      {/* SEO-friendly navigation - hidden visually but accessible to search engines */}
      <nav className="sr-only">
        <ul>
          {menuData.map((item) => (
            <li key={`seo-${item.id}`}>
              <Link href={item.path || "#"}>{item.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default MyNav;