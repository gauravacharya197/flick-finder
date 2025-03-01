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

const MyNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { query } = useSelector((state: RootState) => state.advanceSearch);
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query");
  const [isPending, startTransition] = useTransition();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim())
      startTransition(() => {
        router.push(`/results?query=${encodeURIComponent(query)}`);
      });
  };
  
  const handleClose = () => {
    if (searchQuery) {
      router.push("/results");
    }
    setShowSearch(false);
    dispatch(setQuery(""));
  };
  
  const initializedFromUrl = useRef(false);
  
  useEffect(() => {
    // Only update Redux state once when the component mounts
    if (!initializedFromUrl.current && searchQuery && searchQuery !== query) {
      dispatch(setQuery(searchQuery));
      initializedFromUrl.current = true;
    }
  }, [searchQuery, dispatch, query]);
  
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  
  // Using our custom hook for menu click outside
  useClickOutside(
    [menuButtonRef as any, menuContentRef as any],
    () => setMenuOpen(false),
    menuOpen,
  );
  
  // Using our custom hook for search bar click outside on mobile
  useClickOutside(
    [searchBarRef as any],
    () => setShowSearch(false),
    showSearch,
  );

  const renderFilterButton = () => {
    return (
      <Link
        href="/results"
        onClick={() => setMenuOpen(false)}
        className="flex items-center gap-2 rounded bg-gray-200 px-2 py-1.5 text-sm text-black hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 sm:px-4 sm:text-base"
      >
        <FaFilter className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        <span className="hidden xs:inline">Filter</span>
      </Link>
    );
  };
  
  const renderCloseMdIcon = () => {
    return (
      <>
        {(query || searchQuery) && (
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-10 top-1/2 -translate-y-1/2 transform"
          >
            <IoMdClose className="text-xl text-primary sm:text-2xl" />
          </button>
        )}
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 transform text-primary"
          aria-label="Search"
        >
          {isPending ? <Spinner /> : <FaSearch className="h-4 w-4 sm:h-5 sm:w-5" />}
        </button>
      </>
    );
  };
  
  return (
    <header className="sticky top-0 z-50 bg-gray-300 bg-opacity-90 text-white dark:bg-background dark:text-white">
      <div className="px-2 sm:px-4 lg:px-8 xl:px-16 2xl:px-48">
        <div className="flex h-13 items-center justify-between">
          {/* Left side: Menu button, Logo and RobotSearch */}
          <div className="relative flex items-center gap-2 sm:gap-4">
            <button
              ref={menuButtonRef}
              className="rounded-md p-1 hover:bg-gray-800 dark:hover:bg-gray-700"
              onClick={() => {
                setMenuOpen(!menuOpen);
              }}
              aria-label="Toggle Menu"
            >
              {!menuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 5.75h16.5M3.75 12h16.5m-16.5 6.25h16.5"
                  />
                </svg>
              ) : (
                <MdClose className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>
            
            <Link
              href="/"
              className="rounded-md bg-primary px-2 py-1 text-sm font-bold text-black dark:bg-primary dark:text-black sm:px-3 sm:text-md md:text-xl"
            >
              <SiteName />
            </Link>
            
            {/* Hamburger Menu Content */}
            <div
              ref={menuContentRef}
              className={`absolute left-0 top-full z-40 w-48 overflow-hidden rounded-md bg-black bg-opacity-95 shadow-lg backdrop-blur-sm transition-all duration-300 dark:bg-background sm:w-56 ${
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
                        className="block px-4 py-1 text-sm text-white hover:bg-gray-800 hover:text-primary dark:hover:bg-gray-700 dark:hover:text-primary sm:text-base"
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="hidden sm:block">
              <RobotSearchModal />
            </div>
          </div>

          {/* Search Bar for medium and larger screens */}
          <div className="hidden max-w-xl flex-1 items-center justify-center gap-2 md:flex">
            <div className="flex w-full items-center gap-2">
              {renderFilterButton()}
              <form onSubmit={handleSearch} className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search Movies/TV"
                  value={query}
                  onChange={(e) => dispatch(setQuery(e.target.value))}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-1.5 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                />
                {renderCloseMdIcon()}
              </form>
            </div>
          </div>
          
          {/* Right side controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search icon for small screens */}
            <button
              className="rounded-md p-1.5 hover:bg-gray-800 dark:hover:bg-gray-700 md:hidden"
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Toggle Search"
            >
              <FaSearch className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
            </button>
            
            {/* Robot search for small screens */}
            <div className="sm:hidden">
              <RobotSearchModal />
            </div>
            
            {/* Theme toggler would go here */}
            {/* <ThemeToggler /> */}
            
            {/* Login Button */}
            <LoginPartial />
          </div>
        </div>
      </div>
      
      {/* Search Bar for Small Screens */}
      {showSearch && (
        <div 
          ref={searchBarRef}
          className="bg-white bg-opacity-90 p-2 text-white shadow-md dark:bg-background dark:text-white md:hidden"
        >
          <div className="container mx-auto flex items-center gap-2">
            {renderFilterButton()}
            <form onSubmit={handleSearch} className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => dispatch(setQuery(e.target.value))}
                placeholder="Search Movies/TV"
                className="w-full rounded-md border-gray-300 bg-white px-4 py-1.5 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                autoFocus
              />
              {renderCloseMdIcon()}
            </form>
            <button
              className="rounded-md p-1.5 text-red-500 hover:bg-gray-700 dark:hover:bg-gray-600"
              onClick={() => setShowSearch(false)}
              aria-label="Close Search"
            >
              <MdClose className="text-xl sm:text-2xl" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default MyNav;