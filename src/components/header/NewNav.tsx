"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { FaSearch, FaFilter } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setQuery } from "@/redux/movies/advanceSearchSlice";
import useClickOutside from "@/hooks/useClickOutside";

import UserMenu from "../auth/UserMenu";
import Spinner from "../common/Spin";

export const NewNav = () => {
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
  
  const SearchInput = (className='') =>  {
    return <form onSubmit={handleSearch} className="relative flex-1">
    <input
      type="text"
      value={query}
      onChange={(e) => dispatch(setQuery(e.target.value))}
      placeholder="Search Movies/TV"
      className={`w-full rounded-md px-4 py-1.5 text-black dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
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
  }
  
  // Filter button component
  const FilterButton = () => (
    <></>
  );

  return (
    <header className="sticky top-0 bg-gray-300 bg-opacity-90 text-white dark:bg-background w-full z-50">
      <div className="px-3 mx-auto max-w-full"> 
        <div className="flex h-14 items-center justify-between">
          {/* Left section with search and filter - visible on all devices */}
          <div className="flex items-center gap-2">
            <FilterButton />
            <div className="relative w-32 sm:w-40 md:w-64 lg:w-80 xl:w-96">
              {SearchInput()} 
            </div>
          </div>
          
          {/* Spacer for layout */}
          <div className="hidden md:block md:flex-1"></div>
          
          {/* User menu */}
          <div className="flex items-center gap-4">
            <UserMenu />
          </div>
        </div>
      </div>
      
      {/* Mobile search overlay - removed since we're showing search inline */}
      {showSearch && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden" ref={searchBarRef}>
          <div className="p-4">
            <div className="flex items-center gap-2">
              <button
                className="rounded-md bg-gray-800 p-2 text-white"
                onClick={() => setShowSearch(false)}
                aria-label="Close Search"
              >
                <IoMdClose className="h-5 w-5" />
              </button>
              {SearchInput("w-full")}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};